"use client";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { useEffect, useState, useRef } from "react";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processMarkdown = async () => {
      try {
        // Remove the first H1 title since it's displayed separately
        const contentWithoutTitle = content.replace(/^#\s+.*$/m, "").trim();

        const processor = unified()
          .use(remarkParse) // Parse markdown
          .use(remarkGfm) // Support GitHub Flavored Markdown (tables, strikethrough, etc.)
          .use(remarkRehype, {
            allowDangerousHtml: true, // Allow HTML for embeds
          })
          .use(rehypeSlug) // Add IDs to headings for anchor links
          .use(rehypeHighlight, {
            detect: true,
            ignoreMissing: true,
          }) // Add syntax highlighting
          // .use(rehypeSanitize) // Sanitize HTML
          .use(rehypeStringify, { allowDangerousHtml: true }); // Convert to HTML string

        const result = await processor.process(contentWithoutTitle);
        setHtmlContent(String(result));
      } catch (error) {
        console.error("Error processing markdown:", error);
        // Fallback to simple text display
        setHtmlContent(
          `<div class="text-red-600">Error processing content</div>`
        );
      } finally {
        setIsLoading(false);
      }
    };

    processMarkdown();
  }, [content]);

  // Execute Twitter widgets script after content is rendered
  useEffect(() => {
    if (!isLoading && htmlContent && contentRef.current) {
      const twitterScript = contentRef.current.querySelector(
        'script[src*="platform.twitter.com/widgets.js"]'
      );
      if (twitterScript) {
        // Remove the existing script and create a new one to trigger execution
        const newScript = document.createElement("script");
        newScript.src = "https://platform.twitter.com/widgets.js";
        newScript.async = true;
        newScript.charset = "utf-8";
        document.head.appendChild(newScript);
      }
    }
  }, [isLoading, htmlContent]);

  if (isLoading) {
    return (
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none leading-snug
        prose-h1:mt-6 prose-h1:mb-3 prose-h1:leading-tight
        prose-h2:mt-5 prose-h2:mb-2 prose-h2:leading-tight
        prose-h3:mt-4 prose-h3:mb-1 prose-h3:leading-tight
        prose-p:my-4 prose-p:leading-relaxed
        prose-ul:my-2 prose-ol:my-2
        prose-li:my-1 prose-li:leading-snug
        prose-blockquote:my-4 prose-blockquote:leading-relaxed
        prose-pre:my-4 prose-pre:bg-transparent prose-pre:text-gray-100 prose-pre:!p-0 prose-pre:border-none prose-pre:overflow-x-auto
        prose-code:before:content-none prose-code:after:content-none
        [&_pre_code]:block [&_pre_code]:p-4 [&_pre_code]:bg-slate-800 [&_pre_code]:rounded-md
        [&_code:not(pre_*)]:bg-gray-100 [&_code:not(pre_*)]:text-gray-800 [&_code:not(pre_*)]:px-2 [&_code:not(pre_*)]:py-1 [&_code:not(pre_*)]:rounded [&_code:not(pre_*)]:text-sm
        [&_iframe]:my-6 [&_iframe]:rounded-lg [&_iframe]:shadow-lg
        [&_.twitter-tweet]:my-6"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
