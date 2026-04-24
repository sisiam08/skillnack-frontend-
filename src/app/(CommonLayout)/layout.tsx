import { UserService } from "@/service/user.service";
import Footer from "./_component/shared/Footer";
import Navbar from "./_component/shared/Navbar";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await UserService.getSession();
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-orange-50 via-amber-50/60 to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-foreground transition-colors duration-200">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Original 3 colors only: ORANGE, AMBER, TEAL */}
        
        {/* Top Section */}
        <div className="absolute -top-[1.5%] left-1/2 size-80 -translate-x-1/2 rounded-full bg-orange-300/35 blur-3xl dark:bg-orange-500/25" />
        <div className="absolute top-[2.5%] right-16 size-48 rounded-full bg-teal-200/25 blur-3xl dark:bg-teal-500/15" />
        
        {/* Middle Section */}
        <div className="absolute top-[20%] -translate-y-1/2 right-4 size-56 rounded-full bg-amber-200/18 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute top-[27%] left-2 size-48 rounded-full bg-teal-200/25 blur-3xl dark:bg-teal-500/15" />
        <div className="absolute top-[35%] -right-40 size-70 rounded-full bg-teal-200/25 blur-3xl dark:bg-teal-500/15" />
        <div className="absolute top-[50%] -translate-y-1/2 right-4 size-56 rounded-full bg-amber-200/18 blur-3xl dark:bg-amber-500/10" />
        
        {/* Bottom Section */}
        <div className="absolute top-[62%] -left-10 size-60 -translate-x-1/2 rounded-full bg-orange-300/35 blur-3xl dark:bg-orange-500/20" />
        
        </div>
      
      <div className="relative z-10">
        <Navbar isLoggedIn={!!session.data} />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
