'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function MenuBar({ style }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redirect to Dashboard
  };

  return (
    <nav style={{ background: '#ddd', padding: '5px', ...style }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '20px' }}>
        <li><Link href="/">Dashboard</Link></li>
        <li>Save/Export</li>
        <li>Profile</li>
        {user && <li><button onClick={handleLogout}>Logout</button></li>}
      </ul>
    </nav>
  );
}
