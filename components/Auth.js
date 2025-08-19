'use client';
import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [tier, setTier] = useState('free');

  const handleAuth = async () => {
    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) console.error(error);
    else {
      if (isSignup && tier === 'paid') {
        // Redirect to Stripe checkout via API route
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          body: JSON.stringify({ userId: data.user.id }),
        });
        const { url } = await response.json();
        window.location.href = url;
      } else {
        onAuthSuccess(data.user);
      }
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {isSignup && (
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      )}
      <button onClick={handleAuth}>{isSignup ? 'Sign Up' : 'Login'}</button>
      <button onClick={() => setIsSignup(!isSignup)}>Switch to {isSignup ? 'Login' : 'Sign Up'}</button>
    </div>
  );
}
