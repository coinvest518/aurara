import { Helmet } from "react-helmet";

export function BlogSEO({ title, description }: { title: string; description: string }) {
  return (
    <Helmet>
      <title>{title} | Aurora Blog</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
    </Helmet>
  );
}
