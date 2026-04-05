import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "./App.css";

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: "1px" }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, opacity: 0.6 }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const isGoogleMapsUrl = (href) =>
  href && (href.includes("google.com/maps") || href.includes("maps.google"));

const extractLocationName = (href) => {
  try {
    const url = new URL(href);
    const place = url.pathname.match(/\/place\/([^/@]+)/);
    if (place) return decodeURIComponent(place[1].replace(/\+/g, " "));
    const q = url.searchParams.get("q");
    if (q) return decodeURIComponent(q);
  } catch {}
  return null;
};

const LinkRenderer = ({ href, children }) => {
  const isMaps = isGoogleMapsUrl(href);
  const locationName = isMaps ? extractLocationName(href) : null;
  const displayText =
    typeof children === "string" && children !== href
      ? children
      : locationName || null;

  if (isMaps) {
    return (
      
        <a href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="map-link-card"
      >
        <span className="map-link-icon">
          <MapPinIcon />
        </span>
        <span className="map-link-content">
          <span className="map-link-label">Open in Google Maps</span>
          {displayText && (
            <span className="map-link-place">{displayText}</span>
          )}
        </span>
        <ExternalLinkIcon />
      </a>
    );
  }

  // Generic link
  return (
    
    <a  href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-link"
    >
      {children}
    </a>
  );
};

const MarkdownRenderer = ({ content }) => {
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
            blockquote: ({ node, ...props }) => (
              <blockquote className="md-callout" {...props} />
            ),
            a: ({ node, href, children, ...props }) => (
              <LinkRenderer href={href} children={children} />
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