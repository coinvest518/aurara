import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";

// Lazy load components
const App = lazy(() => import("./App"));
const BlogList = lazy(() => import("./components/Blog").then(module => ({ default: module.BlogList })));
const BlogPost = lazy(() => import("./components/Blog").then(module => ({ default: module.BlogPost })));
const PricingPage = lazy(() => import("./components/PricingPage"));
const PaymentSuccess = lazy(() => import("./components/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./components/PaymentCancel"));
const SubscriptionDebug = lazy(() => import("./components/SubscriptionDebug"));

export default function RootRouter() {
  return (
    <BrowserRouter>      <Layout>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />
            <Route path="/debug/subscription" element={<SubscriptionDebug />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
