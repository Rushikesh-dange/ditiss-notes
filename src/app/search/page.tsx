import prisma from "@/lib/prisma";
import Link from "next/link";
import { FileText, ArrowRight, SearchX } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results | DITISS Notes",
  description: "Search for study notes and subjects.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let posts: any[] = [];

  if (query) {
    posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // limit to 50 results to prevent massive queries
    });
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Search Results</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '1rem' }}>
          {query ? `Showing results for "${query}"` : "Enter a search term to find notes."}
        </p>
      </header>

      {query && posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <SearchX size={64} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <h2>No notes found</h2>
          <p>We couldn't find anything matching "{query}". Try different keywords.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          {posts.map(post => (
            <Link key={post.id} href={`/notes/${post.slug}`}>
              <div className="glass-panel hover-lift" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {post.subject?.name || 'Uncategorized'}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{post.title}</h3>
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
