"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { useTheme } from "next-themes";
import Logo from "./Logo";

function useMobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return {
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  };
}

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const desktopNavLinkClass =
    "rounded-md px-2 py-1 text-sm font-medium text-brand-ink dark:text-brand-ink transition-colors duration-200 hover:text-brand-strong dark:hover:text-brand";
  const mobileNavLinkClass =
    "rounded-xl px-3 py-3 text-sm font-medium text-brand-ink dark:text-brand-ink transition-colors duration-200 hover:text-brand-strong dark:hover:text-brand";

  return (
    <nav className="sticky top-0 z-50 w-full bg-[color-mix(in_oklab,var(--background)_86%,#fff7ed)]/90 dark:bg-card backdrop-blur-md border-b border-brand/10 dark:border-brand/20">
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link className={desktopNavLinkClass} href="/">
              Home
            </Link>

            <Link className={desktopNavLinkClass} href="/#how-it-works">
              How it Works
            </Link>

            {!isLoggedIn && (
              <>
                <Link className={desktopNavLinkClass} href="/login">
                  Login
                </Link>

                <Link className={desktopNavLinkClass} href="/signup">
                  Register
                </Link>

                <ModeToggle />

                <Button className="bg-brand hover:bg-brand-strong text-white px-6 py-4 rounded-2xl text-sm font-semibold transition-all hover:scale-105">
                  <Link href="/find-tutors">Find Tutors</Link>
                </Button>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link className={desktopNavLinkClass} href="/dashboard">
                  Dashboard
                </Link>

                <Button className="bg-brand hover:bg-brand-strong text-white px-6 py-4 rounded-2xl text-sm font-semibold transition-all hover:scale-105">
                  <Link href="/find-tutors">Book Tutor</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Icon */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center p-2 hover:text-brand transition-colors"
          >
            <span className="material-symbols-outlined text-brand-ink dark:text-white">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
          {mobileMenuOpen && (
            <div className="absolute left-4 right-4 top-full z-50 mt-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xl md:hidden">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm font-semibold text-foreground">
                  Menu
                </span>

                <div className="flex items-center gap-2">
                  <ModeToggle />
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="p-2 hover:text-brand transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-brand-ink dark:text-white">
                      close
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  Home
                </Link>

                <Link
                  href="/#how-it-works"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  How it works
                </Link>

                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass}
                    >
                      Login
                    </Link>

                    <Link
                      href="/signup"
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass}
                    >
                      Register
                    </Link>

                    <Button
                      asChild
                      className="h-11 w-full rounded-xl bg-brand text-white shadow-sm hover:bg-brand-strong"
                    >
                      <Link href="/find-tutors" onClick={closeMobileMenu}>
                        Find Tutors
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass}
                    >
                      Dashboard
                    </Link>

                    <Button
                      asChild
                      className="h-11 w-full rounded-xl bg-brand text-white shadow-sm hover:bg-brand-strong"
                    >
                      <Link href="/find-tutors" onClick={closeMobileMenu}>
                        Book Tutor
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
