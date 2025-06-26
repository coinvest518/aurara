import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Settings, Users, User, LogOut } from "lucide-react";
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
          
        </button>
        <h2 className="text-lg font-bold mb-4 text-slate-800">Settings</h2>
        {children}
      </div>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showCompanions, setShowCompanions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img src="/assets/brand/logo.svg" alt="Aurarora Logo" className="h-10 w-auto" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4">
              {/* Home button: routes to /dashboard if logged in, / if not */}
              <Link
                to={user ? "/dashboard" : "/"}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-semibold"
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Blog
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Pricing
              </Link>
              <button onClick={() => setShowCompanions(true)} className="p-2 rounded-full hover:bg-blue-50" title="Companions">
                <Users className="w-5 h-5" />
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 rounded-full hover:bg-blue-50" title="Settings">
                <Settings className="w-5 h-5" />
              </button>
              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <button className="p-2 rounded-full hover:bg-blue-50" title="Profile">
                    <User className="w-5 h-5 text-blue-700" />
                  </button>
                  <span className="text-gray-700 font-medium">{user.email}</span>
                  <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50" title="Logout">
                    <LogOut className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="sm:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Home button: routes to /dashboard if logged in, / if not */}
              <Link
                to={user ? "/dashboard" : "/"}
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-semibold"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Blog
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Pricing
              </Link>
              <button
                onClick={() => { setShowCompanions(true); setShowMobileMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                <Users className="w-5 h-5" />Companions
              </button>
              <button
                onClick={() => { setShowSettings(true); setShowMobileMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />Settings
              </button>
              {user ? (
                <button
                  onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />Logout
                </button>
              ) : null}
            </div>
          </div>
        )}
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
      <main className="flex-1 relative">
        {children}
      </main>

      {/* Settings Modal */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)}>
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
            © 2025 Aurarora AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}