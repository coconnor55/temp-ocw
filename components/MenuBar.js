import Link from 'next/link';

export default function MenuBar({ style }) {
  return (
    <nav style={{ background: '#ddd', padding: '5px', ...style }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '20px' }}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/editor">New Application</Link></li>
        <li>Save/Export</li> {/* Add onClick to save state */}
        <li>Profile</li>
        <li>Logout</li>
      </ul>
    </nav>
  );
}
