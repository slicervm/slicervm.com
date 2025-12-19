import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/config";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Back Button */}
      <div className="border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="font-mono -ml-2" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 pb-8 border-b border-border/50">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-primary/10 text-primary border border-primary/20 font-mono text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 border border-primary/20 p-2">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">
                  {" "}
                  {Array.isArray(post.authors) ? post.authors[0] : post.authors}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {/*<div className="text-muted-foreground">{post.readTime}</div>*/}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-base md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-8 lg:prose-p:leading-8 prose-p:text-foreground/90 prose-li:text-foreground/90 prose-li:my-2 prose-strong:text-foreground prose-code:font-mono  prose-code:px-1.5 prose-code:py-0.5 prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-pre:shadow-lg">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypePrettyCode,
                    {
                      theme: "vitesse-light",
                      keepBackground: false, // Removes the default theme background
                    },
                  ],
                ],
              },
            }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-12 border-t border-border/50">
          <Button variant="ghost" size="sm" className="font-mono -ml-2" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </footer>
      </article>

      {/* Footer */}
      <Footer />
    </div>
  );
}
