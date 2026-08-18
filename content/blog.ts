import fs from "node:fs";
import path from "node:path";

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; language: string; code: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  featured?: boolean;
  blocks: BlogBlock[];
};

const postsDirectory = path.join(process.cwd(), "content", "blog");

// content/blog klasöründeki bütün JSON yazıları her çağrıda yeniden okunur.
export function getBlogPosts(): BlogPost[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort()
    .map((fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      return JSON.parse(fs.readFileSync(filePath, "utf8")) as BlogPost;
    })
    .sort((first, second) => second.date.localeCompare(first.date));
}

export function getPostBySlug(slug: string) {
  return getBlogPosts().find((post) => post.slug === slug);
}

export function getReadTime(post: BlogPost) {
  const articleText = post.blocks
    .map((block) => (block.type === "code" ? block.code : block.text))
    .join(" ");
  const wordCount = articleText.trim().split(/\s+/u).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} dk okuma`;
}
