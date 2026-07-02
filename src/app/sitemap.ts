import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/config";

const staticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog/", changeFrequency: "weekly", priority: 0.8 },
  { path: "/mac/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/microvms/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/egress/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/pricing/", changeFrequency: "monthly", priority: 0.6 },
  { path: "/eula/", changeFrequency: "yearly", priority: 0.3 },
] as const;

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

function lastModified(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}/`),
      lastModified: lastModified(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
