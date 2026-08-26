import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Inbox, LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login-rushi");
  }

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', gap: '2rem', padding: '4rem 2rem', alignItems: 'flex-start' }}>
      <aside className="glass-panel" style={{ width: '250px', padding: '1.5rem', position: 'sticky', top: '120px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          Admin Panel
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin/messages" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(67, 97, 238, 0.1)', color: 'var(--accent-primary)', fontWeight: 500 }}>
            <Inbox size={20} />
            Messages Inbox
          </Link>
          
          <Link href="/api/auth/signout" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', marginTop: '2rem' }}>
            <LogOut size={20} />
            Sign Out
          </Link>
        </nav>
      </aside>

      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
