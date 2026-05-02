import Link from "next/link";

const seoLinks: Array<{ href: string; label: string }> = [
  { href: "/microvms", label: "MicroVMs" },
  { href: "/egress", label: "Egress Filtering Proxy" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "https://docs.slicervm.com", label: "Docs" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-2">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav
          aria-label="Site links"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6"
        >
          {seoLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

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
