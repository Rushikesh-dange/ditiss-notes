"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Check, Copy } from 'lucide-react';

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (e.g. "language-js")
  let language = '';
  if (className) {
    const match = /language-(\w+)/.exec(className);
    if (match) {
      language = match[1];
    }
  }
  
  const handleCopy = () => {
    if (children) {
      // Remove any HTML tags that rehype-highlight might have injected when copying
      const textToCopy = typeof children === 'string' 
        ? children 
        : String(children).replace(/<[^>]*>?/gm, '');
      navigator.clipboard.writeText(textToCopy.replace(/\n$/, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!inline && language) {
    return (
      <div className="code-block-wrapper">
        <div className="code-block-header">
          <span className="code-language">{language}</span>
          <button onClick={handleCopy} className="copy-button" aria-label="Copy code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre style={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  }

  // Fallback for code blocks without language
  if (!inline) {
    return (
      <div className="code-block-wrapper">
        <div className="code-block-header" style={{ justifyContent: 'flex-end' }}>
          <button onClick={handleCopy} className="copy-button" aria-label="Copy code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre style={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
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
      rehypePlugins={[rehypeSanitize, rehypeHighlight]}
      components={{
        code: CodeBlock as any
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
