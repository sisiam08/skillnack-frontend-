"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted/60" />,
});

const HERO_CARD_SCENE_URL =
  "https://prod.spline.design/nCbiOFP47lG1EI2y/scene.splinecode";

export function InteractiveServiceCards() {
  return (
    <div className="absolute lg:-left-70 lg:top-0 h-[110%] w-[160%]">
      <Spline
        scene={HERO_CARD_SCENE_URL}
        renderOnDemand
        className="h-full w-full"
      />
    </div>
  );
}
