import React from 'react';

export function AtlasMark({ className = '' }) {
  return <svg className={`atlas-logo-mark ${className}`} viewBox="0 0 40 40" role="img" aria-label="Atlas"><circle cx="20" cy="20" r="16" /><path d="M13 27 27 13l-5 11-9 3Z" /><circle cx="20" cy="20" r="2" /></svg>;
}

export function AtlasBrand({ className = '' }) {
  return <span className={`atlas-brand ${className}`}><AtlasMark /><span>ATLAS</span></span>;
}
