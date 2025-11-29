/** @jsxImportSource react */
import { ImageResponse } from "@vercel/og";
import { getCollection } from "astro:content";

export const config = {
  runtime: "edge",
};

export async function GET({ params }) {
  const { slug } = params;

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
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </div>

        {tagString && (
          <div
            style={{
              fontSize: 32,
              color: "#94a3b8",
              marginTop: "40px",
            }}
          >
            {tagString}
          </div>
        )}

        <div
          style={{
            fontSize: 36,
            color: "#2dd4bf",
            marginTop: "auto",
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
