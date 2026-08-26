import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import { Share2, Link as LinkIcon, MessageCircle, Mail } from 'lucide-react';

export const revalidate = 300; // Cache for 5 minutes
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ 
    where: { published: true },
    select: { slug: true } 
  });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | RD Blog`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: "article",
      publishedTime: post.createdAt.toISOString(),
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, subject: true }
  });

  if (!post || !post.published) {
    notFound();
  }

  // Fetch all posts from the same subject to determine sequential order
  const allSubjectPosts = await prisma.post.findMany({
    where: { 
      published: true,
      subjectId: post.subjectId,
    }
  });

  // Sort naturally so "[Day 1] 2. " comes before "[Day 1] 10. "
  allSubjectPosts.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));

  // Find the index of the current post
  const currentIndex = allSubjectPosts.findIndex(p => p.id === post.id);
  
  let relatedPosts: typeof allSubjectPosts = [];
  if (currentIndex !== -1) {
    // Grab the next 2 posts in sequence
    relatedPosts = allSubjectPosts.slice(currentIndex + 1, currentIndex + 3);
  }

  // If we are at the very end of the subject, wrap around to the first ones so the section isn't empty
  if (relatedPosts.length < 2 && allSubjectPosts.length > 2) {
    const needed = 2 - relatedPosts.length;
    relatedPosts = [...relatedPosts, ...allSubjectPosts.slice(0, needed)];
  }

  return (
    <>
      <ProgressBar />
      
      <div className="container" style={{ display: 'flex', gap: '3rem', padding: '4rem 2rem', position: 'relative' }}>
        
        {/* Sticky Social Share Sidebar */}
        <aside style={{ display: 'none' }} className="social-sidebar">
          <div style={{ position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Share</span>
            <button className="hover-lift" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><LinkIcon size={24} /></button>
            <button className="hover-lift" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><MessageCircle size={24} /></button>
            <button className="hover-lift" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><Mail size={24} /></button>
            <button className="hover-lift" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><Share2 size={24} /></button>
          </div>
        </aside>

        {/* Main Article Content */}
        <article style={{ flex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
            {post.subject && (
              <Link href={`/subject/${post.subject.slug}`}>
                <div className="hover-lift" style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(67, 97, 238, 0.1)', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', cursor: 'pointer' }}>
                  {post.subject.name}
                </div>
              </Link>
            )}
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-1px', lineHeight: 1.1 }}>{post.title}</h1>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {post.author.name?.[0] || 'A'}
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.author.name}</span>
              </div>
              <span>•</span>
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <span>•</span>
              <span>{Math.ceil(post.content.length / 1000)} min read</span>
            </div>
          </header>

          <div className="prose animate-fade-in" style={{ paddingBottom: '4rem', borderBottom: '1px solid var(--border-color)' }}>
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
          </div>

          {/* Retention Feature: Read Next */}
          {relatedPosts.length > 0 && (
            <section style={{ marginTop: '4rem' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Read Next</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {relatedPosts.map(related => (
                  <Link key={related.id} href={`/notes/${related.slug}`} style={{ display: 'block' }}>
                    <div className="glass-panel hover-lift" style={{ padding: '2rem', height: '100%' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {new Date(related.createdAt).toLocaleDateString()}
                      </div>
                      <h4 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{related.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {related.excerpt || related.content.substring(0, 100) + '...'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
