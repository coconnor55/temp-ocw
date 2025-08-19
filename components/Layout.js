import Head from 'next/head';
import MenuBar from './MenuBar';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Write My Patent!</title>
        <meta name="description" content="AI-powered patent drafting tool" />
      </Head>
      <header style={{ background: '#f0f0f0', padding: '10px', textAlign: 'center', position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
        <h1>Write My Patent!</h1>
      </header>
      <MenuBar style={{ position: 'fixed', top: '50px', width: '100%', zIndex: 9 }} /> {/* Adjust top based on title height */}
      <main style={{ marginTop: '100px' }}>{children}</main> {/* Offset for fixed bars */}
    </>
  );
}
