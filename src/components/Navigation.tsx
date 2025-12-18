"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-1">
        <div className="flex justify-between items-center h-10">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-800"
              style={{ fontFamily: "Courier New" }}
            >
              SlicerVM
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`text-gray-700 hover:text-indigo-600 px-2 py-1 rounded-md text-sm font-medium transition duration-300 ${
                pathname === "/"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`text-gray-700 hover:text-indigo-600 px-2 py-1 rounded-md text-sm font-medium transition duration-300 ${
                pathname.startsWith("/pricing")
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : ""
              }`}
            >
              Pricing
            </Link>
            <a
              href="https://docs.slicervm.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-indigo-600 px-2 py-1 rounded-md text-sm font-medium transition duration-300"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
