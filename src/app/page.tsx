import styles from "./page.module.css";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";

export default async function Home() {
  const subjects = await prisma.subject.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="container animate-fade-in">
      {/* Enhanced Hero Section */}
      <section className={styles.hero} style={{
        position: 'relative',
        padding: '6rem 0 4rem',
      }}>
        {/* Decorative Background Mesh */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(67, 97, 238, 0.08) 0%, transparent 60%)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <h1 className={styles.title} style={{ fontSize: '4.5rem', lineHeight: 1.1 }}>
          DITISS <br/>
          <span className="text-gradient">Knowledge Base.</span>
        </h1>
        <p className={styles.subtitle} style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          An organized collection of study notes and resources for CDAC DITISS juniors.
        </p>
      </section>

      <section className={styles.latestPosts} style={{ paddingBottom: '6rem' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '3rem', textAlign: 'center' }}>Browse by Subject</h2>
        
        {subjects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 0' }}>No subjects available yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {subjects.map(subject => (
              <Link key={subject.id} href={`/subject/${subject.slug}`} style={{ display: 'block' }}>
                <div className="glass-panel hover-lift" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(67, 97, 238, 0.1)', color: 'var(--accent-primary)', padding: '0.8rem', borderRadius: '12px' }}>
                      <Folder size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{subject.name}</h3>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 600 }}>{subject._count.posts} Notes</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
