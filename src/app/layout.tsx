import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DITISS Notes Hub | CDAC ACTS & Sunbeam Infotech Study Material",
  description: "A comprehensive knowledge base and study material collection for CDAC DITISS students across Sunbeam, IACSD, and ACTS.",
  keywords: ["CDAC", "DITISS", "Sunbeam", "Sunbeam Infotech", "CDAC ACTS", "IACSD", "CDAC Notes", "DITISS Study Material", "Cyber Security Notes", "Computer Networks", "Cyber Forensics"],
  openGraph: {
    title: "DITISS Notes Hub | CDAC Study Material",
    description: "A comprehensive knowledge base for DITISS juniors at Sunbeam, ACTS, and IACSD.",
    url: "https://blog.rushikeshdange.online",
    siteName: "DITISS Notes Hub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DITISS Notes Hub",
    description: "The ultimate collection of CDAC DITISS study material.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container header-content">
            <Link href="/" className="logo">
              DITISS<span className="text-gradient"> Notes</span>
            </Link>
            <div className="header-actions">
              <nav className="nav-links">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/cmce-test" className="nav-link">CMCE Test</Link>
                <Link href="/ccee-test" className="nav-link">CCEE Test</Link>
                <Link href="/contact" className="nav-link">Contact</Link>
              </nav>
              <form action="/search" method="GET" className="search-form">
                <input 
                  type="search" 
                  name="q" 
                  placeholder="Search notes..." 
                  className="search-input"
                  required
                />
              </form>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
