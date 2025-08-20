'use client';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [tier, setTier] = useState('free');
  const [confirmation, setConfirmation] = useState(false);
  const [supabase] = useState(() => require('../utils/supabase').supabase);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check session on mount to handle redirects
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) onAuthSuccess(session.user);
    };
    checkSession();
  }, [supabase, onAuthSuccess]);

  const handleAuth = async () => {
    setError(null);
    let { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password, options: { data: { tier } } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else if (isSignup) {
      setConfirmation(true); // Show confirmation on signup success
    } else {
      // For login, check if email is verified
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        onAuthSuccess(user);
      } else {
        setError('Please verify your email before logging in.');
      }
    }
  };

  const handleProceed = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
      onAuthSuccess(session.user);
    } else {
      setError('Please verify your email first.');
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => {}} // Prevent closing unless authenticated
      className="auth-modal"
      overlayClassName="auth-overlay"
    >
      {!confirmation ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="auth-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="auth-input"
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleAuth} className="auth-button">
            {isSignup ? 'Create Account' : 'Login'}
          </button>
          <button onClick={() => setIsSignup(!isSignup)} className="auth-button">
            {isSignup ? 'Login' : 'Create Account'}
          </button>
          {isSignup && (
            <>
              <select value={tier} onChange={(e) => setTier(e.target.value)} className="auth-input">
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
              <button onClick={handleAuth} className="auth-button">
                Sign Up
              </button>
            </>
          )}
        </>
      ) : (
        <div className="auth-confirmation">
          <p>Confirmation email sent! Check your inbox to verify your account.</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleProceed} className="auth-button">
            Proceed to Main Window
          </button>
        </div>
      )}
    </Modal>
  );
}
