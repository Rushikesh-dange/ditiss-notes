import { Construction } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CCEE Test Series | DITISS Notes",
};

export default function CCEETestPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(67, 97, 238, 0.1)', padding: '2rem', borderRadius: '50%', color: 'var(--accent-primary)', marginBottom: '2rem' }}>
        <Construction size={64} />
      </div>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>CCEE Test Series</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
        Our team is working on it! Stay tuned, we will update you soon.
      </p>
    </div>
  );
}
