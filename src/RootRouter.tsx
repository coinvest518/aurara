import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { BlogList, BlogPost } from "./components/Blog";
import Layout from "./components/Layout";
import PricingPage from "./components/PricingPage";

export default function RootRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
