import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  {
    title: "Explore",
    links: [
      { label: "Find Tutors", href: "/find_tutors" },
      { label: "Featured Tutors", href: "/#featured-tutors" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "For Students",
    links: [
      { label: "Find a Tutor", href: "/find_tutors" },
      { label: "Book a Session", href: "/find_tutors" },
      { label: "Student Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "For Tutors",
    links: [
      { label: "Become a Tutor", href: "/register" },
      { label: "Tutor Dashboard", href: "/tutor-dashboard" },
      { label: "Manage Availability", href: "/tutor-dashboard/availability" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-200 bg-brand-surface pb-10 pt-16 dark:border-gray-800 dark:bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex w-fit items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
                <GraduationCap
                  className="size-5"
                  strokeWidth={2.2}
                  suppressHydrationWarning
                />
              </div>
              <span className="ui-title-brand">Skillnack</span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              The world&apos;s leading marketplace for 1-on-1 expert tutoring.
              Master any skill with personal guidance.
            </p>
          </div>

          {navLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-5 text-sm font-bold text-brand-ink dark:text-white">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
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
          <Separator className="bg-gray-200 dark:bg-gray-800" />
          <div className="flex items-center justify-center pt-8 text-xs text-gray-500 md:flex-row dark:text-gray-400">
            <p>&copy; {currentYear} Skillnack. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
