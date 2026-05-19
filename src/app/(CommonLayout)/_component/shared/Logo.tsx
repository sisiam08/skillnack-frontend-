"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Logo({ width, height, h }: { width?: number; height?: number; h?: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link href="/">
      <Image
        src={
          resolvedTheme === "dark"
            ? "/ilmefy_icon+name-dark.svg"
            : "/ilmefy_icon+name-light.svg"
        }
        alt="Ilmefy"
        width={width || 100}
        height={height || 56}
        className={h ? `w-auto h-${h}` : "w-auto h-14"}
        priority
      />
    </Link>
  );
}
