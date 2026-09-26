import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Bangladeshi Taka (৳) as a text glyph. Drop-in compatible with lucide icon
 * components for currency slots: accepts the same `className` /
 * `suppressHydrationWarning` props used where icons are rendered.
 * lucide-react has no Taka icon, and the rest of the UI already shows ৳ as text.
 */
export default function TakaIcon({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      {...props}
      data-slot="taka-icon"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center font-bold leading-none",
        className,
      )}
    >
      ৳
    </span>
  );
}
