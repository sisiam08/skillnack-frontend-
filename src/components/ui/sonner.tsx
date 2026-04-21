"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { isValidElement, type ReactNode } from "react"
import {
  Toaster as Sonner,
  toast as sonnerToast,
  type ExternalToast,
  type ToasterProps,
} from "sonner"


const normalizeToastContent = (
  content: Parameters<typeof sonnerToast>[0],
  fallback: string,
): Parameters<typeof sonnerToast>[0] => {
  if (typeof content === "function") {
    return () => normalizeToastValue(content(), fallback)
  }

  return normalizeToastValue(content, fallback)
}

const normalizeToastValue = (
  content: ReactNode,
  fallback: string,
): ReactNode => {
  if (typeof content === "string") {
    const trimmed = content.trim()
    return trimmed || fallback
  }

  if (typeof content === "number" || typeof content === "bigint") {
    return String(content)
  }

  if (content == null || typeof content === "boolean") {
    return fallback
  }

  if (
    isValidElement(content) ||
    (Array.isArray(content) && content.every(isSafeToastChild))
  ) {
    return content
  }
  return fallback
}

const isSafeToastChild = (content: ReactNode): boolean => {
  if (typeof content === "string" || typeof content === "number") {
    return true
  }

  if (content == null || typeof content === "boolean") {
    return true
  }

  if (isValidElement(content)) {
    return true
  }

  return Array.isArray(content) && content.every(isSafeToastChild)
}

const normalizeToastOptions = (
  data: ExternalToast | undefined,
  fallbackDescription: string,
): ExternalToast | undefined => {
  if (!data || data.description === undefined) {
    return data
  }

  return {
    ...data,
    description: normalizeToastContent(data.description, fallbackDescription),
  }
}

const createToastMethod =
  (
    method: (message: Parameters<typeof sonnerToast>[0], data?: ExternalToast) => string | number,
    fallback: string,
  ) =>
  (message: Parameters<typeof sonnerToast>[0], data?: ExternalToast) =>
    method(
      normalizeToastContent(message, fallback),
      normalizeToastOptions(data, fallback),
    )

const toast = Object.assign(
  (
    message: Parameters<typeof sonnerToast>[0],
    data?: ExternalToast,
  ) =>
    sonnerToast(
      normalizeToastContent(message, "Notice"),
      normalizeToastOptions(data, "Notice"),
    ),
  sonnerToast,
  {
    error: createToastMethod(sonnerToast.error, "Something went wrong."),
    info: createToastMethod(sonnerToast.info, "Notice"),
    loading: createToastMethod(sonnerToast.loading, "Loading..."),
    message: createToastMethod(sonnerToast.message, "Notice"),
    success: createToastMethod(sonnerToast.success, "Success"),
    warning: createToastMethod(sonnerToast.warning, "Warning"),
  },
)

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { toast, Toaster }

