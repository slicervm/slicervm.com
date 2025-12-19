import { promises as fs } from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  authors: string | string[];
  tags: string[];
  content: string;
  image?: string;
  canonical?: string;
}

const postsDirectory = path.join(process.cwd(), "posts");

// Function to extract excerpt from content
function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown headers and formatting
  const cleanContent = content
    .replace(/^#+\s+/gm, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
    .trim();

  // Get first paragraph or truncate
  const firstParagraph = cleanContent.split("\n\n")[0];
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength).trim() + "...";
}

// Manual frontmatter parser
function parseMarkdownFile(content: string): {
  data: Record<string, string | string[] | boolean>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const [, frontmatter, markdownContent] = match;
  const data: Record<string, string | string[] | boolean> = {};
  let currentKey = "";
  let inArray = false;

  // Parse YAML-like frontmatter line by line
  frontmatter.split("\n").forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) return;

    if (trimmedLine.startsWith("- ")) {
      // Array item
      const value = trimmedLine
        .substring(2)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (currentKey && inArray) {
        if (!Array.isArray(data[currentKey])) {
          data[currentKey] = [];
        }
        (data[currentKey] as string[]).push(value);
      }
    } else {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line
          .substring(colonIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");

        currentKey = key;
        inArray = !value; // If no value after colon, it's likely an array

        if (value) {
          data[key] = value;
          inArray = false;
        } else {
          // Initialize empty array for upcoming list items
          data[key] = [];
          inArray = true;
        }
      }
    }
  });

  return { data, content: markdownContent };
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    const markdownFiles = fileNames.filter((name) => name.endsWith(".md"));

    const posts = await Promise.all(
      markdownFiles.map(async (fileName) => {
        try {
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = await fs.readFile(fullPath, "utf8");
          const { data, content } = parseMarkdownFile(fileContents);

          // Extract slug from filename or frontmatter
          const slug =
            (typeof data.slug === "string" ? data.slug : undefined) ||
            fileName.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");

          // Extract excerpt if not provided
          const excerpt =
            (typeof data.excerpt === "string" ? data.excerpt : undefined) ||
            extractExcerpt(content);

          const post: BlogPost = {
            slug,
            title: typeof data.title === "string" ? data.title : "Untitled",
            excerpt,
            date:
              typeof data.date === "string"
                ? data.date
                : new Date().toISOString(),
            authors: (() => {
              // Handle 'authors' array field
              if (Array.isArray(data.authors)) {
                return data.authors;
              }
              // Handle 'author' string field
              if (typeof data.author === "string") {
                return data.author;
              }
              // Handle 'authors' string field
              if (typeof data.authors === "string") {
                return data.authors;
              }
              return "Unknown";
            })(),
            tags: Array.isArray(data.tags) ? data.tags : [],
            image: typeof data.image === "string" ? data.image : undefined,
            canonical:
              typeof data.canonical === "string" ? data.canonical : undefined,
            content,
          };

          return post;
        } catch {
          return null;
        }
      })
    );

    // Filter out null posts and sort by date (newest first)
    const validPosts = posts.filter((post): post is BlogPost => post !== null);

    return validPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    return [];
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const posts = await getAllBlogPosts();
    return posts.find((post) => post.slug === slug) || null;
  } catch {
    return null;
  }
}
