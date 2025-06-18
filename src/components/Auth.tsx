import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export const Auth: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmToast, setShowEmailConfirmToast] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
      if (!result.error) {
        setShowEmailConfirmToast(true);
        setTimeout(() => setShowEmailConfirmToast(false), 6000);
      }
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
      if (!result.error) onAuthSuccess();
    }
    setLoading(false);
    if (result.error) setError(result.error.message);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="max-w-xs mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      {showEmailConfirmToast && (
        <div className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow">
          Check your email to confirm your account before logging in.
        </div>
      )}
      <h2 className="text-xl font-bold mb-4 text-center">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-blue-600 underline text-sm"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
      <div className="mt-4 text-center">
        <button
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={handleGoogleLogin}
          type="button"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};
