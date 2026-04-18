"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon
          className={`h-[1.2rem] w-[1.2rem] transition-colors text-white`}
        />
      ) : (
        <Sun
          className={`h-[1.2rem] w-[1.2rem] transition-colors text-brand-ink`}
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

