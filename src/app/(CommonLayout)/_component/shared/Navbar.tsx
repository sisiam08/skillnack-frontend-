"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/shared/ModeToggle";

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
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[color-mix(in_oklab,var(--background)_86%,#fff7ed)]/90 dark:bg-[color-mix(in_oklab,var(--background)_88%,#1f130b)]/90 backdrop-blur-md border-b border-brand/10 dark:border-brand/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center gap-3">
              <div className="size-9 bg-brand rounded-lg flex items-center justify-center text-white">
                <GraduationCap
                  className="size-5"
                  strokeWidth={2.2}
                  suppressHydrationWarning
                />
              </div>

              <span className="ui-title-brand">Skillnack</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors"
              href="/"
            >
              Home
            </Link>

            <Link
              className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors"
              href="/#featured-tutors"
            >
              Featured Tutors
            </Link>

            {!isLoggedIn && (
              <>
                <Link
                  className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors"
                  href="/login"
                >
                  Login
                </Link>

                <Link
                  className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors"
                  href="/signup"
                >
                  Register
                </Link>

                <ModeToggle />

                <Button className="bg-brand hover:bg-brand-strong text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                  <Link href="/find-tutors">Find Tutors</Link>
                </Button>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link
                  className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors"
                  href="/dashboard"
                >
                  Dashboard
                </Link>

                <Button className="bg-brand hover:bg-brand-strong text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                  <Link href="/find-tutors">Book Tutor</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Icon */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center p-2 hover:text-brand transition-colors"
          >
            <span className="material-symbols-outlined text-brand-ink dark:text-white">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
          )}

          {/* Mobile Sidebar Menu */}
          <div
            className={`fixed top-0 right-0 h-screen w-72 bg-brand-surface dark:bg-brand-surface shadow-xl md:hidden z-50 transform transition-all duration-300 ease-in-out ${
              mobileMenuOpen
                ? "translate-x-0 visible"
                : "translate-x-full invisible"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-brand/10 dark:border-brand/20">
                <button
                  onClick={closeMobileMenu}
                  className="p-2 hover:text-brand transition-colors"
                >
                  <span className="material-symbols-outlined text-xl text-brand-ink dark:text-white">
                    close
                  </span>
                </button>

                <ModeToggle />
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors py-2.5"
                >
                  Home
                </Link>

                <Link
                  href="/#featured-tutors"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors py-2.5"
                >
                  Featured Tutors
                </Link>

                {!isLoggedIn && (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors py-2.5"
                    >
                      Login
                    </Link>

                    <Link
                      href="/signup"
                      onClick={closeMobileMenu}
                      className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors py-2.5"
                    >
                      Register
                    </Link>

                    <Button className="w-full bg-brand hover:bg-brand-strong text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                      <Link href="/find-tutors" onClick={closeMobileMenu}>
                        Find Tutors
                      </Link>
                    </Button>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-brand-ink dark:text-brand-ink hover:text-brand transition-colors py-2.5"
                    >
                      Dashboard
                    </Link>

                    <Button className="w-full bg-brand hover:bg-brand-strong text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                      <Link href="/find-tutors" onClick={closeMobileMenu}>
                        Book Tutor
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
