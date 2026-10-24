import React from 'react';
import './App.css';
import { AtlasMark } from './brand.jsx';

// Inline markdown: `code`, **bold**, *italic*, [label](url) and bare URLs.
const inlinePattern = /(`[^`\n]+`)|(\*\*[^*\n]+?\*\*|__[^_\n]+?__)|(\[[^\]\n]+\]\(https?:\/\/[^)\s]+\))|(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])|(\*[^*\s\n][^*\n]*?\*)/g;

function Inline({ value }) {
  const text = String(value); const parts = []; let last = 0;
  for (const match of text.matchAll(inlinePattern)) {
    const [token] = match; const key = `${match.index}-${token.length}`;
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) parts.push(<code className="inline-code" key={key}>{token.slice(1, -1)}</code>);
    else if (match[2]) parts.push(<strong key={key}><Inline value={token.slice(2, -2)} /></strong>);
    else if (match[3]) { const [, label, href] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token); parts.push(<a className="inline-link" href={href} key={key} target="_blank" rel="noreferrer">{label}</a>); }
    else if (match[4]) parts.push(<a className="inline-link" href={token} key={key} target="_blank" rel="noreferrer">{token.replace(/^https?:\/\/(www\.)?/, '')}</a>);
    else parts.push(<em key={key}><Inline value={token.slice(1, -1)} /></em>);
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const keycap = /\s*(\d)️?⃣\s*/;
const listMarker = { bullet: /^(\s*)[-*•]\s+/, ordered: /^(\s*)(\d+)[.)]\s+/, keycap: /^(\s*)(\d)️?⃣\s*/ };
const listType = (line) => Object.keys(listMarker).find((type) => listMarker[type].test(line));
const isRule = (line) => /^\s*([-*_])(\s*\1){2,}\s*$/.test(line);
const isTableRule = (line) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
const tableCells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
const startsBlock = (lines, index) => { const line = lines[index]; return line.startsWith('```') || /^#{1,4}\s+/.test(line) || listType(line) || line.startsWith('>') || isRule(line) || (line.includes('|') && index + 1 < lines.length && isTableRule(lines[index + 1])); };

// Models often run numbered emoji steps (1️⃣ … 2️⃣ …) together on one line; give each its own line.
function normalise(content) {
  return String(content || '').replace(/\r/g, '').split('\n').flatMap((line) => ((line.match(new RegExp(keycap.source, 'g')) || []).length > 1 ? line.replace(new RegExp(keycap.source, 'g'), (token) => `\n${token.trim()} `).split('\n').filter((part) => part.trim()) : [line]));
}

function MessageBlocks({ content }) {
  const lines = normalise(content); const blocks = []; let index = 0;
  while (index < lines.length) {
    const line = lines[index]; const key = `block-${index}`;
    if (!line.trim()) { index += 1; continue; }
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text'; const code = []; index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) { code.push(lines[index]); index += 1; }
      if (index < lines.length) index += 1;
      blocks.push(<pre className="atlas-code" key={key}><span>{language}</span><code>{code.join('\n')}</code></pre>); continue;
    }
    if (line.includes('|') && index + 1 < lines.length && isTableRule(lines[index + 1])) {
      const header = tableCells(line); const rows = []; index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) { rows.push(tableCells(lines[index])); index += 1; }
      blocks.push(<div className="table-wrapper" key={key}><table className="custom-markdown-table"><thead><tr>{header.map((cell, cellIndex) => <th key={cellIndex}><Inline value={cell} /></th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{header.map((_, cellIndex) => <td key={cellIndex}><Inline value={row[cellIndex] || ''} /></td>)}</tr>)}</tbody></table></div>); continue;
    }
    if (isRule(line)) { blocks.push(<hr className="md-rule" key={key} />); index += 1; continue; }
    const heading = /^(#{1,4})\s+(.+?)\s*#*$/.exec(line);
    if (heading) { const level = Math.min(heading[1].length, 3); const Tag = `h${level + 1}`; blocks.push(<Tag className={`md-heading-${level}`} key={key}><Inline value={heading[2]} /></Tag>); index += 1; continue; }
    // A line that is only bold text ("**Day 1 · Tokyo**") reads as a section label.
    const label = /^\s*\*\*([^*]+)\*\*:?\s*$/.exec(line);
    if (label) { blocks.push(<h4 className="md-heading-3" key={key}><Inline value={label[1]} /></h4>); index += 1; continue; }
    const type = listType(line);
    if (type) {
      const items = []; const start = Number(listMarker[type].exec(line)[2]) || 1;
      while (index < lines.length) {
        const current = lines[index];
        if (!current.trim()) { let next = index + 1; while (next < lines.length && !lines[next].trim()) next += 1; if (next < lines.length && (listType(lines[next]) === type || (items.length && /^\s{2,}\S/.test(lines[next])))) { index = next; continue; } break; }
        const indent = /^\s*/.exec(current)[0].length;
        if (items.length && indent >= 2 && (listType(current) || !startsBlock(lines, index))) { const nested = current.replace(/^\s+/, ''); items[items.length - 1].children.push(listType(nested) ? nested.replace(listMarker[listType(nested)], '') : nested); index += 1; continue; }
        if (listType(current) !== type) break;
        items.push({ text: current.replace(listMarker[type], ''), children: [] }); index += 1;
      }
      const List = type === 'bullet' ? 'ul' : 'ol';
      blocks.push(<List className={`md-list md-list-${type}`} style={start !== 1 ? { counterReset: `atlas-step ${start - 1}` } : undefined} key={key}>{items.map((item, itemIndex) => <li className="md-list-item" key={itemIndex}><Inline value={item.text} />{item.children.length > 0 && <ul className="md-list md-list-bullet md-list-nested">{item.children.map((child, childIndex) => <li className="md-list-item" key={childIndex}><Inline value={child} /></li>)}</ul>}</li>)}</List>); continue;
    }
    if (line.startsWith('>')) {
      const quote = [];
      while (index < lines.length && lines[index].startsWith('>')) { quote.push(lines[index].replace(/^>\s?/, '')); index += 1; }
      blocks.push(<blockquote className="md-callout" key={key}>{quote.map((part, partIndex) => <p key={partIndex}><Inline value={part} /></p>)}</blockquote>); continue;
    }
    const paragraph = [line]; index += 1;
    while (index < lines.length && lines[index].trim() && !startsBlock(lines, index)) { paragraph.push(lines[index]); index += 1; }
    blocks.push(<p className="md-paragraph" key={key}>{paragraph.map((part, partIndex) => <React.Fragment key={partIndex}>{partIndex > 0 && <br />}<Inline value={part} /></React.Fragment>)}</p>);
  }
  return blocks;
}

export default function Message({ content }) {
  return <article className="bot-message"><header className="bot-message-head"><AtlasMark className="bot-avatar" /><span>Atlas</span></header><div className="markdown-body-container"><MessageBlocks content={content} /></div></article>;
}
