import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  authors: string | string[];
  category?: string;
  readTime?: string;
  tags: string[];
  featured?: boolean;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blog/${post.slug}`}>
        <div className="px-8 pt-8 pb-6">
          {/* Title */}
          <h3 className="text-3xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
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

          {/* Meta Info */}
          <div className="flex items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
            <span>
              {Array.isArray(post.authors) ? post.authors[0] : post.authors}
            </span>
            <span className="mx-2">•</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
