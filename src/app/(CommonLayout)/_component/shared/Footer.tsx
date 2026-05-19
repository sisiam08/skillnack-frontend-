import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Logo from "./Logo";

const navLinks = [
  {
    title: "Explore",
    links: [
      { label: "Find Tutors", href: "/find-tutors" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Login", href: "/login" },
      { label: "Sign Up", href: "/signup" },
    ],
  },
  {
    title: "For Students",
    links: [
      { label: "Find a Tutor", href: "/find-tutors" },
      { label: "Book a Session", href: "/find-tutors" },
      { label: "Student Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "For Tutors",
    links: [
      { label: "Become a Tutor", href: "/signup" },
      { label: "Tutor Dashboard", href: "/tutor-dashboard" },
      { label: "Manage Availability", href: "/tutor-dashboard/availability" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-brand/10 bg-[color-mix(in_oklab,var(--background)_88%,#fff7ed)] pb-10 pt-16 dark:border-brand/25 dark:bg-card">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Logo height={88} h={22} />

            <p className="text-sm leading-relaxed text-muted-foreground">
              The world&apos;s leading marketplace for 1-on-1 expert tutoring.
              Master any skill with personal guidance.
            </p>
          </div>

          {navLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-5 text-sm font-bold text-brand-ink dark:text-brand-ink">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
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

        <div className="mt-12">
          <Separator className="bg-brand/15 dark:bg-brand/25" />
          <div className="flex items-center justify-center pt-8 text-xs text-muted-foreground md:flex-row">
            <p>&copy; {currentYear} Ilmefy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
