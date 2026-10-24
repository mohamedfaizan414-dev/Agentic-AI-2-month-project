import React from 'react';

export function LoadingScreen() {
  return <main className="page-loading" aria-label="Loading Atlas"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14" /><path d="M14 26 25 14l-4 10-7 2Z" /></svg><span>Preparing your travel desk</span></main>;
}

export class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main className="page-recovery"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14" /><path d="M14 26 25 14l-4 10-7 2Z" /></svg><p className="kicker">ATLAS</p><h1>Let’s get you<br />back on course.</h1><p>The page did not load as expected. Refresh once to continue to your travel desk.</p><button onClick={() => window.location.reload()}>Refresh Atlas</button></main> : this.props.children; }
}
