import { ImageResponse } from "@vercel/og";
import { getCollection } from "astro:content";

export const config = {
  runtime: "edge",
};

export async function GET({ params }) {
  const { slug } = params;

  // Load the blog post
  const posts = await getCollection("blog");
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const title = post.data.title;
  const tags = post.data.tags || [];
  const tagString = tags.join(" • ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0f172a",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>

        <div
          style={{
            fontSize: 32,
            opacity: 0.8,
            marginTop: "20px",
          }}
        >
          {tagString}
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#2dd4bf",
            marginTop: "40px",
          }}
        >
          Patrick’s Data Lab
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
