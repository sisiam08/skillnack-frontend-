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

  // SVG viewBox is 720x318 (icon + wordmark). Tailwind spacing unit = 4px.
  const renderedHeight = h ? h * 4 : height || 56;
  const renderedWidth = width || Math.round((renderedHeight * 720) / 318);

  // Size purely via the intrinsic width/height props (no CSS override) so
  // next/image does not warn about a modified width/height.
  return (
    <Link href="/">
      <Image
        src={
          resolvedTheme === "dark"
            ? "/ilmefy_icon+name-dark.svg"
            : "/ilmefy_icon+name-light.svg"
        }
        alt="Ilmefy"
        width={renderedWidth}
        height={renderedHeight}
        priority
      />
    </Link>
  );
}
