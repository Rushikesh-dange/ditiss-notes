const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const notesDir = path.join(__dirname, '..', 'DITISS-Study-Resources');

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function cleanObsidianMarkdown(content) {
  let cleaned = content.replace(/\[\[(.*?)\]\]/g, '$1');
  return cleaned;
}

function walkSync(currentDirPath, callback, rootDir = currentDirPath) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    
    if (name.startsWith('.') || name === 'README.md') return;
    
    if (stat.isFile()) {
      if (name.endsWith('.md')) {
        const relativePath = path.relative(rootDir, filePath);
        const topLevelDir = relativePath.split(path.sep)[0];
        const immediateDir = path.basename(currentDirPath);
        callback(filePath, stat, topLevelDir, immediateDir);
      }
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback, rootDir);
    }
  });
}

async function main() {
  console.log('Fetching admin user...');
  let adminUser = await prisma.user.findFirst({
    where: { email: 'admin@blog.com' }
  });

  if (!adminUser) {
    console.error('Admin user not found. Creating one...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = await prisma.user.create({
      data: {
        name: 'DITISS Admin',
        email: 'admin@blog.com',
        password: hashedPassword,
      },
    });
  }

  let postsAdded = 0;
  let subjectsAdded = 0;

  console.log('Scanning DITISS repository...');
  
  const filesToProcess = [];
  walkSync(notesDir, (filePath, stat, topLevelDir, immediateDir) => {
    let subject = topLevelDir;
    // If the topLevelDir is the file itself (meaning it's in the root), map it to 'General'
    if (subject.endsWith('.md')) {
      subject = 'General';
    }
    filesToProcess.push({ filePath, subject, immediateDir, topLevelDir });
  }, notesDir);
  
  console.log(`Found ${filesToProcess.length} markdown files to import.`);

  // Cache subjects
  const subjectMap = {};

  for (const fileObj of filesToProcess) {
    const { filePath, subject, immediateDir } = fileObj;
    
    // Ensure subject exists
    if (!subjectMap[subject]) {
      const subjectSlug = generateSlug(subject);
      let dbSubject = await prisma.subject.findUnique({ where: { slug: subjectSlug } });
      if (!dbSubject) {
        dbSubject = await prisma.subject.create({
          data: { name: subject, slug: subjectSlug }
        });
        subjectsAdded++;
      }
      subjectMap[subject] = dbSubject.id;
    }

    let fileName = path.basename(filePath, '.md');
    let title = fileName;
    
    // If the immediate parent isn't the subject itself or the root, prefix it
    if (immediateDir !== subject && immediateDir !== 'DITISS-Study-Resources' && immediateDir !== 'General') {
      title = `[${immediateDir}] ${fileName}`;
    }

    const slug = generateSlug(title);
    
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    content = cleanObsidianMarkdown(content);
    
    const excerpt = content.replace(/#+.*\n/g, '').replace(/\n/g, ' ').substring(0, 150).trim() + '...';

    await prisma.post.create({
      data: {
        title: title,
        slug: uniqueSlug,
        content: content,
        excerpt: excerpt,
        published: true,
        authorId: adminUser.id,
        subjectId: subjectMap[subject]
      }
    });

    postsAdded++;
    console.log(`Imported: [${subject}] ${title}`);
  }

  console.log(`\nSuccessfully created ${subjectsAdded} subjects and imported ${postsAdded} notes!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
