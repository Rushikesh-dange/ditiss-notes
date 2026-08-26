import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 300; // Cache for 5 minutes
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const subjects = await prisma.subject.findMany({ select: { slug: true } });
  return subjects.map((subject) => ({
    slug: subject.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = await prisma.subject.findUnique({ where: { slug } });
  
  if (!subject) return { title: "Subject Not Found" };
  
  return {
    title: `${subject.name} | DITISS Notes`,
  };
}

export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  
  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true }
      }
    }
  });

  if (!subject) {
    notFound();
  }

  // Sort naturally so "[Day 2]" comes before "[Day 10]"
  subject.posts.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '4rem' }}>
        <Link href="/" style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 600 }}>
          ← Back to Subjects
        </Link>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>{subject.name}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '1rem' }}>
          {subject.posts.length} notes available in this subject.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {subject.posts.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No notes in this subject yet.</p>
        ) : (
          subject.posts.map(post => (
            <Link key={post.id} href={`/notes/${post.slug}`}>
              <div className="glass-panel hover-lift" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{post.title}</h3>
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
