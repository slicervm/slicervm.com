import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo-slicer.png"
            alt="SlicerVM Logo"
            width={250}
            height={125}
            className="mx-auto mb-4"
            priority
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Courier New" }}>SlicerVM.com</h2>
          <p className="text-xl md:text-2xl text-gray-700">
            Create your own cloud with lightweight microVMs.
          </p>
        </div>

        {/* Description */}
        <div className="mb-12">
          <p className="text-left text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            microVMs boot and scale quickly - for long running workloads, and short-lived tasks alike.
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-indigo-600 mb-4">At home: the fastest way to learn &amp; experiment with Firecracker</h2>
            <p className="text-gray-600 mb-6">
              Make your N100, Raspberry Pi, or home server into a powerful lab. Experiment with microVMs, Kubernetes, and AI agents in an isolated environment that just works.
            </p>
            <p className="text-gray-600 mb-6">
              Join like-minded self-hosted and home-labbers on our Discord server.
            </p>
            <h2 className="text-lg font-semibold text-indigo-600 mb-4">Slicer at work</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Launch large Kubernetes clusters in less than a minute</li>
              <li>• Reproduce customer support cases, and introduce chaos testing</li>
              <li>• Run background jobs, code workspaces, and isolated AI agents via API</li>
              <li>• Build and run customer code, with secure isolation</li>
              <li>• Run GPU-powered AI and LLM workloads</li>
            </ul>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href="https://docs.slicervm.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            📚 View Documentation
          </a>
          <a
            href="https://blog.alexellis.io/slicer-bare-metal-preview/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg border border-indigo-200 transition duration-300 transform hover:scale-105"
          >
            📰 Read the Blog Post
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-gray-500 text-sm">
          <p>© 2025 <a href="https://openfaas.com">OpenFaaS Ltd</a>. Made with ❤️ for the self-hosted community.</p>
        </footer>
      </div>
    </div>
  );
}
