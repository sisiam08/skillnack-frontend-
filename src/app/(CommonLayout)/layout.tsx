import Navbar from "./_component/shared/Navbar";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar isLoggedIn={false} />
      <main>{children}</main>
    </div>
  );
}
