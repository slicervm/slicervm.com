import { Metadata } from "next";
import BlogCard from "../../components/blog/BlogCard";
import { getAllBlogPosts } from "../../lib/blog";

export const metadata: Metadata = {
  title: "Blog - SlicerVM",
  description:
    "Latest news, tutorials, and insights about microVMs, Firecracker, and cloud infrastructure.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SlicerVM Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The latest news, tutorials, case-studies, and announcements.
          </p>
        </div>
        {/* All Blog Posts */}
        <section>
          <div className="space-y-4">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => <BlogCard key={post.slug} post={post} />)
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>No blog posts found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
