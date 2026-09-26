import { Card } from "@/components/ui/card";

export default function FindTutorsLoading() {
  return (
    <main className="relative mx-auto w-full max-w-7xl px-4 py-8">
      <Card className="mb-6 h-28 animate-pulse border-border/70" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="h-96 w-full shrink-0 animate-pulse border-border/70 lg:w-64" />
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="h-56 animate-pulse border-border/70"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
