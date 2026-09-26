import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

const siteDescription =
  "Ilmefy connects students and professionals with expert tutors for focused, pay-per-session 1-on-1 online help. Describe your problem, book a tutor, and solve it in one session.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ilmefy — Find Your Perfect Tutor",
    template: "%s | Ilmefy",
  },
  description: siteDescription,
  keywords: [
    "online tutoring",
    "find a tutor",
    "1-on-1 tutoring",
    "private tutor",
    "programming tutor",
    "math tutor",
    "Ilmefy",
    "Bangladesh tutoring",
  ],
  applicationName: "Ilmefy",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Ilmefy",
    title: "Ilmefy — Find Your Perfect Tutor",
    description: siteDescription,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ilmefy — Find Your Perfect Tutor",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
