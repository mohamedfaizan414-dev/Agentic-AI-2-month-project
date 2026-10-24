import React from 'react';

export function AtlasMark({ className = '' }) {
  return <svg className={`atlas-logo-mark ${className}`} viewBox="0 0 64 64" role="img" aria-label="Atlas"><circle className="orbit-ring" cx="32" cy="32" r="27" /><circle className="orbit-ring orbit-inner" cx="32" cy="32" r="21" /><path className="orbit-line" d="M10 37C22 10 48 14 55 28M9 27c15-7 33-5 46 11M20 54c2-19 18-33 35-31" /><path className="needle-gold" d="m17 47 28-30-13 22Z" /><path className="needle-light" d="m47 17-28 30 13-22Z" /><circle className="needle-core" cx="32" cy="32" r="5" /><circle className="cardinal north" cx="32" cy="9" r="1.8" /><circle className="cardinal east" cx="55" cy="32" r="1.8" /><circle className="cardinal south" cx="32" cy="55" r="1.8" /><circle className="cardinal west" cx="9" cy="32" r="1.8" /></svg>;
}

export function AtlasBrand({ className = '' }) {
  return <span className={`atlas-brand ${className}`}><AtlasMark /><span>ATLAS</span></span>;
}
