'use client';
import { useState } from 'react';
import Modal from 'react-modal';
import '../styles/authModal.css'; // Import new CSS

Modal.setAppElement('#__next');

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [tier, setTier] = useState('free');
  const [confirmation, setConfirmation] = useState(false);
  const [supabase] = useState(() => require('../utils/supabase').supabase); // Dynamic import

  const handleAuth = async () => {
    let { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password, options: { data: { tier } } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) console.error(error);
    else {
      if (isSignup) {
        setConfirmation(true); // Show confirmation on signup
      } else {
        onAuthSuccess(data.user);
      }
    }
  };

  const handleProceed = () => {
    onAuthSuccess(); // Proceed to main window after confirmation
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
          <button onClick={handleProceed} className="auth-button">
            Proceed to Main Window
          </button>
        </div>
      )}
    </Modal>
  );
}
