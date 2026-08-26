"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      studentName: formData.get("name"),
      email: formData.get("email"),
      institute: formData.get("institute"),
      question: formData.get("question"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        alert("Failed to send message. Please try again.");
        setStatus("idle");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
      setStatus("idle");
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '6rem 2rem', maxWidth: '800px' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-1px' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Have a question or suggestion? Reach out to our team.</p>
      </header>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        {status === "success" ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            <CheckCircle size={64} style={{ color: 'green', margin: '0 auto 1.5rem' }} />
            <h2>Message Sent!</h2>
            <p style={{ marginTop: '1rem' }}>Thank you for reaching out. We will get back to you soon.</p>
            <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => setStatus("idle")}>
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontWeight: 600 }}>Student Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                required 
                placeholder="John Doe"
                style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                required 
                placeholder="john@example.com"
                style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="institute" style={{ fontWeight: 600 }}>Institute Name</label>
              <input 
                type="text" 
                id="institute" 
                name="institute"
                required 
                placeholder="CDAC ACTS"
                style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="question" style={{ fontWeight: 600 }}>Question / Message</label>
              <textarea 
                id="question" 
                name="question"
                required 
                placeholder="How can I contribute to the notes?"
                rows={5}
                style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', width: '100%', resize: 'vertical' }}
              />
            </div>

            <button type="submit" disabled={status === "submitting"} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', opacity: status === 'submitting' ? 0.7 : 1 }}>
              {status === "submitting" ? "Sending..." : "Submit Message"}
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
