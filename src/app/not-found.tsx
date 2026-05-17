import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-orange-50 via-amber-50/60 to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-300/35 blur-3xl dark:bg-orange-500/25" />
        <div className="absolute bottom-8 -left-10 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-500/20" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-500/15" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand shadow-sm dark:bg-zinc-900/80">
          <GraduationCap className="size-4 text-brand" />
          Ilmefy
        </div>

        <p className="text-7xl font-black tracking-tight text-brand-ink sm:text-8xl lg:text-9xl dark:text-white">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-brand-ink sm:text-3xl lg:text-4xl dark:text-white">
          We can't find that page
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
          The link might be broken or the page may have been moved. Let's get
          you back to learning with a quick jump below.
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="w-full bg-brand text-white hover:bg-brand-strong"
          >
            <Link href="/">
              <Home className="mr-2 size-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/find-tutors">
              <Search className="mr-2 size-4" />
              Find Tutors
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
          If you believe this is an error, contact support and we'll help you
          out.
        </p>
      </div>
    </main>
  );
}
