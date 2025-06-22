import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { BlogSEO } from "./BlogSEO";

// Helper to import all markdown files in blog directory (Vite-specific)
const blogFiles = import.meta.glob("/src/blog/*.md", { query: '?raw', import: 'default' });

interface BlogMeta {
  title: string;
  date: string;
  description: string;
  slug: string;
}

function parseFrontmatter(md: string): BlogMeta {
  const lines = md.split("\n");
  const title =
    lines.find((l) => l.startsWith("title:"))?.replace("title:", "").replace(/['"]+/g, "").trim() || "Untitled";
  const date =
    lines.find((l) => l.startsWith("date:"))?.replace("date:", "").replace(/['"]+/g, "").trim() || "";
  const description =
    lines.find((l) => l.startsWith("description:"))?.replace("description:", "").replace(/['"]+/g, "").trim() ||
    "";
  return { title, date, description, slug: "" };
}

export function BlogList() {
  const [posts, setPosts] = useState<BlogMeta[]>([]);

  useEffect(() => {
    Promise.all(
      Object.entries(blogFiles).map(async ([path, loader]) => {
        const md = await (loader as () => Promise<string>)();
        const meta = parseFrontmatter(md);
        meta.slug = path.split("/").pop()?.replace(/\.md$/, "") || "";
        return meta;
      })
    ).then((all) => {
      setPosts(all.sort((a, b) => b.date.localeCompare(a.date)));
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center text-slate-900">Aurora Blog</h1>
      <div className="grid gap-10 md:grid-cols-2">
        {posts.map((post) => (
          <div key={post.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-xs text-accent-teal font-semibold mb-2">Aurora Article</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h3>
              <span className="text-xs text-slate-400 mb-2">{post.date}</span>
              <p className="text-slate-700 mb-4 flex-1">{post.description}</p>
              <Link to={`/blog/${post.slug}`} className="text-accent-teal font-semibold hover:underline mt-auto">Read More</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<string | null>(null);
  const [meta, setMeta] = useState<BlogMeta | null>(null);

  useEffect(() => {
    if (!slug) return;
    const file = Object.keys(blogFiles).find((path) => path.endsWith(`/${slug}.md`));
    if (file) {
      (blogFiles[file] as () => Promise<string>)().then((md) => {
        setPost(md);
        setMeta(parseFrontmatter(md));
      });
    }
  }, [slug]);

  if (!post || !meta) return <div className="text-center py-12">Loading...</div>;

  // Remove frontmatter for rendering
  const content = post.replace(/^---[\s\S]*?---/, "").trim();

  return (
    <div className="max-w-2xl mx-auto py-12">
      <BlogSEO title={meta.title} description={meta.description} />
      <Link to="/blog" className="text-blue-700 hover:underline">
        ← Back to Blog
      </Link>
      <article className="prose lg:prose-xl mt-6">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
