import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-2">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-mono">
            © 2025 OpenFaaS Ltd. Made by the team behind OpenFaaS, Inlets, and
            Actuated.
          </p>
          <p className="font-mono mt-2 pt-2 border-t border-border/50">
            <span>Follow </span>
            <a
              href="https://slicervm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
            >
              @slicervm on X (Twitter)
            </a>
            <span> for updates.</span>
          </p>
          <p className="font-mono mt-2">
            <Link
              href="/eula"
              className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              EULA
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
