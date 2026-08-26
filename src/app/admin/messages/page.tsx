import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', letterSpacing: '-0.5px' }}>Messages Inbox</h1>
      
      {messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <p>No messages yet. When students submit the contact form, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>{msg.studentName}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '1rem' }}>
                    <span>{msg.email}</span>
                    <span>•</span>
                    <span>{msg.institute}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {msg.question}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
