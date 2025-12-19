import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogPosts } from "../../../lib/blog";
import MarkdownContent from "../../../components/blog/MarkdownContent";
import { SITE_URL, SITE_NAME } from "../../../lib/config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found - SlicerVM Blog",
      description: "The requested blog post could not be found.",
    };
  }

  const description = post.excerpt || `Read ${post.title} on SlicerVM Blog`;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} - SlicerVM Blog`,
    description,
    authors: [
      { name: Array.isArray(post.authors) ? post.authors[0] : post.authors },
    ],
    keywords: post.tags,
    publisher: "SlicerVM",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: post.canonical || url,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      siteName: SITE_NAME,
      url,
      locale: "en_US",
      publishedTime: post.date,
      authors: post.authors,
      tags: post.tags,
      ...(post.image && { images: [post.image] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.image && { images: [post.image] }),
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article>
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-indigo-600">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-indigo-600">
                Blog
              </Link>
            </div>
          </nav>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta info */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="font-medium">
                {Array.isArray(post.authors) ? post.authors[0] : post.authors}
              </span>
              <span>•</span>
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <MarkdownContent content={post.content} />

          {/* Back to Blog */}
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to all posts
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
