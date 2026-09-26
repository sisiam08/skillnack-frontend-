import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Logo from "./Logo";

// Cleaned up: previous columns (Explore / For Students / For Tutors) duplicated
// navbar links (Home, How it Works, Login, Register, Find Tutors, Dashboard) and
// were removed. These columns link only to pages that exist.
const navLinks = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund & Cancellation", href: "/refund-policy" },
    ],
  },
  {
    title: "Support",
    links: [{ label: "FAQ / Help Center", href: "/faq" }],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-brand/10 bg-[color-mix(in_oklab,var(--background)_88%,#fff7ed)] pt-8 pb-6 dark:border-brand/25 dark:bg-card">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Logo height={88} h={22} />

            <p className="text-sm leading-relaxed text-muted-foreground">
              The world&apos;s leading marketplace for 1-on-1 expert tutoring.
              Master any skill with personal guidance.
            </p>
          </div>

          {navLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-bold text-brand-ink dark:text-brand-ink">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {section.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-brand"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Separator className="bg-brand/15 dark:bg-brand/25" />
          <div className="flex items-center justify-center pt-4 text-xs text-muted-foreground md:flex-row">
            <p>&copy; {currentYear} Ilmefy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
