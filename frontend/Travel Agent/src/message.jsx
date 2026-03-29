import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "./App.css";

const MarkdownRenderer = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bot-message">
      <div className="markdown-body-container">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="md-heading-1" {...props} />,
            h2: ({ node, ...props }) => <h2 className="md-heading-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="md-heading-3" {...props} />,
            p:  ({ node, ...props }) => <p  className="md-paragraph"  {...props} />,
            ul: ({ node, ...props }) => <ul className="md-list"        {...props} />,
            ol: ({ node, ...props }) => <ol className="md-list"        {...props} />,
            li: ({ node, ...props }) => <li className="md-list-item"   {...props} />,
            strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
            em:     ({ node, ...props }) => <em     className="md-em"     {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="md-callout" {...props} />,
            hr: () => <hr className="markdown-body-container hr" />,
            table: ({ node, ...props }) => (
              <div className="table-wrapper">
                <table className="custom-markdown-table" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => <thead {...props} />,
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr:    ({ node, ...props }) => <tr {...props} />,
            th:    ({ node, ...props }) => <th {...props} />,
            td:    ({ node, ...props }) => <td {...props} />,
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              return !inline && match ? (
                <div className="code-block-wrapper">
                  <div className="code-block-header">
                    <span className="lang-label">{match[1]}</span>
                    <button
                      className="copy-button"
                      onClick={() => navigator.clipboard.writeText(codeString)}
                    >
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    {...props}
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0, padding: "18px",
                      background: "transparent",
                      fontSize: "14px", lineHeight: "1.6",
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="inline-code" {...props}>{children}</code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>

        {/* Copy full message button — shown only for longer responses */}
        {content && content.length > 200 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', paddingBottom: '4px' }}>
            <button
              onClick={handleCopy}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                color: copied ? '#34d399' : '#6b7280',
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {copied ? '✓ Copied' : 'Copy response'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownRenderer;
