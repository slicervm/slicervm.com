import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `Blog - ${SITE_NAME}`,
  description: "The latest news, tutorials, case-studies, and announcements.",
};

export default async function BlogPage() {
  // Get all blog posts from markdown files (already sorted by date)
  let blogPosts: Awaited<ReturnType<typeof getAllBlogPosts>> = [];
  try {
    blogPosts = await getAllBlogPosts();
  } catch (error) {
    console.error("Failed to load blog posts:", error);
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance mb-3">
            SlicerVM Blog
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            The latest news, tutorials, case-studies, and announcements.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {blogPosts.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="block group">
              <Card className="border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.slice(0, 3).map((tag, j) => (
                      <Badge
                        key={j}
                        variant="secondary"
                        className="bg-primary/10 text-primary border border-primary/20 font-mono text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground border-0 font-mono text-xs"
                      >
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <h2 className="text-lg font-bold tracking-tight mb-1.5 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>
                        {Array.isArray(post.authors)
                          ? post.authors[0]
                          : post.authors}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {" "}
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 text-primary font-medium font-mono">
                      <span>Read more</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
