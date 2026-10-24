import React from 'react';
import './App.css';

const urlPattern = /(https?:\/\/[^\s<]+)/g;

function Inline({ value }) {
  return String(value).split(urlPattern).map((part, index) => /^https?:\/\//.test(part)
    ? <a className="inline-link" href={part} key={`${part}-${index}`} target="_blank" rel="noreferrer">{part}</a>
    : part);
}

function tableCells(line) { return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()); }
function isTableRule(line) { return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line); }

function MessageBlocks({ content }) {
  const lines = String(content || '').replace(/\r/g, '').split('\n'); const blocks = []; let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text'; const code = []; index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) { code.push(lines[index]); index += 1; }
      if (index < lines.length) index += 1;
      blocks.push(<pre className="atlas-code" key={`code-${index}`}><span>{language}</span><code>{code.join('\n')}</code></pre>); continue;
    }
    if (line.includes('|') && index + 1 < lines.length && isTableRule(lines[index + 1])) {
      const header = tableCells(line); const rows = []; index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) { rows.push(tableCells(lines[index])); index += 1; }
      blocks.push(<div className="table-wrapper" key={`table-${index}`}><table className="custom-markdown-table"><thead><tr>{header.map((cell, cellIndex) => <th key={cellIndex}><Inline value={cell} /></th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{header.map((_, cellIndex) => <td key={cellIndex}><Inline value={row[cellIndex] || ''} /></td>)}</tr>)}</tbody></table></div>); continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) { const Tag = `h${heading[1].length}`; blocks.push(<Tag className={`md-heading-${heading[1].length}`} key={`heading-${index}`}><Inline value={heading[2]} /></Tag>); index += 1; continue; }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line); const items = [];
      while (index < lines.length && (ordered ? /^\s*\d+[.)]\s+/.test(lines[index]) : /^\s*[-*]\s+/.test(lines[index]))) { items.push(lines[index].replace(ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/, '')); index += 1; }
      const List = ordered ? 'ol' : 'ul'; blocks.push(<List className="md-list" key={`list-${index}`}>{items.map((item, itemIndex) => <li className="md-list-item" key={itemIndex}><Inline value={item} /></li>)}</List>); continue;
    }
    if (line.startsWith('>')) { blocks.push(<blockquote className="md-callout" key={`quote-${index}`}><Inline value={line.replace(/^>\s?/, '')} /></blockquote>); index += 1; continue; }
    const paragraph = [line]; index += 1;
    while (index < lines.length && lines[index].trim() && !lines[index].startsWith('```') && !/^(#{1,3})\s+/.test(lines[index]) && !/^\s*[-*]\s+/.test(lines[index]) && !/^\s*\d+[.)]\s+/.test(lines[index]) && !lines[index].startsWith('>') && !(lines[index].includes('|') && index + 1 < lines.length && isTableRule(lines[index + 1]))) { paragraph.push(lines[index]); index += 1; }
    blocks.push(<p className="md-paragraph" key={`paragraph-${index}`}><Inline value={paragraph.join(' ')} /></p>);
  }
  return blocks;
}

export default function Message({ content }) { return <article className="bot-message"><div className="markdown-body-container"><MessageBlocks content={content} /></div></article>; }
