import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Layout from "./components/Layout";
import { supabase } from "./supabaseClient";

// Lazy load components
const App = lazy(() => import("./App"));
const BlogList = lazy(() => import("./components/Blog").then(module => ({ default: module.BlogList })));
const BlogPost = lazy(() => import("./components/Blog").then(module => ({ default: module.BlogPost })));
const PricingPage = lazy(() => import("./components/PricingPage"));
const PaymentSuccess = lazy(() => import("./components/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./components/PaymentCancel"));
const SubscriptionDebug = lazy(() => import("./components/SubscriptionDebug"));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; user: any }> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />; // Redirect to landing/auth page if not authenticated
  }
  return <>{children}</>;
};

export default function RootRouter() {
  const [user, setUser] = useState<any>(null);

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
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/blog"
              element={
                <ProtectedRoute user={user}>
                  <BlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <ProtectedRoute user={user}>
                  <BlogPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pricing"
              element={
                <ProtectedRoute user={user}>
                  <PricingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute user={user}>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cancel"
              element={
                <ProtectedRoute user={user}>
                  <PaymentCancel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/debug/subscription"
              element={
                <ProtectedRoute user={user}>
                  <SubscriptionDebug />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
