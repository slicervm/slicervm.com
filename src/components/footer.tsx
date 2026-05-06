import Link from "next/link";
import Image from "next/image";

type NavLink = { href: string; label: string; external?: boolean };

const navLinks: NavLink[] = [
  { href: "/microvms", label: "MicroVMs" },
  { href: "/egress", label: "Egress Filtering" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "https://docs.slicervm.com", label: "Docs" },
  {
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform?usp=sharing&ouid=108694999418382910484",
    label: "Contact",
    external: true,
  },
  { href: "/eula", label: "EULA" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-2 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Image
                src="/images/logo-slicer-20-281-29.png"
                alt="SlicerVM"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-lg font-bold font-mono tracking-tight">
                SlicerVM
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Programmable microVMs with egress filtering.
            </p>
            <a
              href="https://slicervm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              @slicervm on X →
            </a>
          </div>

          <FooterLinks links={navLinks.slice(0, 3)} />
          <FooterLinks links={navLinks.slice(3)} />
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-muted-foreground">
          <p>© 2026 OpenFaaS Ltd.</p>
          <p>Made by the team behind OpenFaaS, Inlets, and Actuated.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: NavLink[] }) {
  const className =
    "text-sm text-muted-foreground hover:text-foreground transition-colors";
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {link.label}
            </a>
          ) : (
            <Link href={link.href} className={className}>
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
