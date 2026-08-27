"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { Check, Copy } from 'lucide-react';

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  
  const handleCopy = () => {
    if (children) {
      navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!inline && match) {
    return (
      <div className="code-block-wrapper">
        <div className="code-block-header">
          <span className="code-language">{match[1]}</span>
          <button onClick={handleCopy} className="copy-button" aria-label="Copy code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className={className} style={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  }

  // Fallback for inline code or code blocks without language
  if (!inline) {
    return (
      <div className="code-block-wrapper">
        <div className="code-block-header" style={{ justifyContent: 'flex-end' }}>
          <button onClick={handleCopy} className="copy-button" aria-label="Copy code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className={className} style={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      components={{
        code: CodeBlock as any
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
