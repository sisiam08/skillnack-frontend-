import { ReactNode } from "react";

export function InfoPage({
  title,
  subtitle,
  updated,
  children,
}: {
  title: string;
  subtitle?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="relative mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="ui-title-panel text-3xl">{title}</h1>
        {subtitle ? (
          <p className="text-muted-foreground">{subtitle}</p>
        ) : null}
        {updated ? (
          <p className="text-xs text-muted-foreground">Last updated: {updated}</p>
        ) : null}
      </header>

      <div className="space-y-8 text-sm leading-7">{children}</div>
    </main>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-2 text-muted-foreground">{children}</div>
    </section>
  );
}

export function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
