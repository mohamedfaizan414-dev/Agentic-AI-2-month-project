import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "./App.css";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="bot-message">
      <div className="markdown-body-container">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="md-heading-1" {...props} />
            ),

            h2: ({ node, ...props }) => (
              <h2 className="md-heading-2" {...props} />
            ),

            h3: ({ node, ...props }) => (
              <h3 className="md-heading-3" {...props} />
            ),

            p: ({ node, ...props }) => (
              <p className="md-paragraph" {...props} />
            ),

            ul: ({ node, ...props }) => (
              <ul className="md-list" {...props} />
            ),

            ol: ({ node, ...props }) => (
              <ol className="md-list" {...props} />
            ),

            li: ({ node, ...props }) => (
              <li className="md-list-item" {...props} />
            ),

            blockquote: ({ node, ...props }) => (
              <blockquote className="md-callout" {...props} />
            ),

            table: ({ node, ...props }) => (
              <div className="table-wrapper">
                <table className="custom-markdown-table" {...props} />
              </div>
            ),

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
                      margin: 0,
                      padding: "18px",
                      background: "transparent",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;