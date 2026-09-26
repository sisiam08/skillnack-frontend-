"use client";

import dynamic from "next/dynamic";

// The Zego prebuilt UI is heavy; load it only on the class route, client-side.
const ClassDynamic = dynamic(() => import("./Class"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-background text-sm text-muted-foreground">
      Loading live session…
    </div>
  ),
});

export default ClassDynamic;
