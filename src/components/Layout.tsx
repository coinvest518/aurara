import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, Settings } from "lucide-react";
import { supabase } from "../supabaseClient";
import PricingTabs from './PricingTabs';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPricing, setShowPricing] = useState(false);

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
            <button
              onClick={() => setShowPricing(true)}
              className="hover:underline font-medium text-accent-teal"
            >
              Pricing
            </button>
            {user && (
              <>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex-1">{children}</main>
      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
              onClick={() => setShowPricing(false)}
              aria-label="Close pricing"
            >
              ×
            </button>
            <PricingTabs />
          </div>
        </div>
      )}
      {/* Footer (optional, can be improved) */}
      <footer className="bg-[#33292c] text-white py-8 mt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Aurora. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
