import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, Settings } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useSubscription } from "../hooks/useSubscription";
import CompanionCarousel from "./CompanionCarousel";

// Settings Modal Component
const SettingsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-md relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
          onClick={onClose}
          aria-label="Close settings"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-slate-800">Settings</h2>
        {children}
      </div>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showCompanions, setShowCompanions] = useState(false);
  const { subscription } = useSubscription();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Add logout button to the header
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redirect to landing page after logout
  };

  return (
    <div className="min-h-screen bg-[#f6efef] text-[#33292c] flex flex-col">
      {/* Header / Navigation */}
      <nav className="bg-white/80 shadow backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Link to="/" className="relative h-10 w-10 block">
              <div className="absolute inset-0 animate-pulse rounded-xl bg-accent-teal/20" />
              <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-accent-teal">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </Link>
            <span className="text-xl font-semibold text-[#33292c]">Aurora - AI Companion</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className={`hover:underline font-medium ${location.pathname === '/' ? 'text-accent-teal' : ''}`}>Home</Link>
            <Link to="/blog" className={`hover:underline font-medium ${location.pathname.startsWith('/blog') ? 'text-accent-teal' : ''}`}>Blog</Link>
            <Link to="/pricing" className={`hover:underline font-medium ${location.pathname === '/pricing' ? 'text-accent-teal' : ''}`}>
              Pricing
            </Link>
            <button
              onClick={() => setShowCompanions(true)}
              className="rounded-lg bg-accent-teal text-white px-4 py-2 font-semibold hover:bg-accent-teal/90 transition"
            >
              View Companions
            </button>
            {user && (
              <>
                <button
                  onClick={() => setShowSettings(true)}
                  className="relative h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <Settings className="h-4 w-4 text-gray-600" />
                </button>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Companions Modal */}
      {showCompanions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-4xl w-full relative">
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
              onClick={() => setShowCompanions(false)}
              aria-label="Close companions"
            >
              ×
            </button>
            <CompanionCarousel onClose={() => setShowCompanions(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Settings Modal */}      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account Settings</span>
          </div>
          <hr />
          {user && (
            <div className="text-sm">
              <div className="mb-4">
                <p className="font-medium text-gray-700">Email</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="mb-4">
                <p className="font-medium text-gray-700">Subscription Status</p>
                <p className="text-gray-600 capitalize">
                  {subscription?.subscription_type || 'Free'}
                  {subscription?.current_period_end && (
                    <span className="text-xs text-gray-500 ml-2">
                      (until {new Date(subscription.current_period_end).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
          <hr />
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setShowSettings(false);
            }}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </SettingsModal>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 Aurora AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}