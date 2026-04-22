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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar isLoggedIn={!!session.data} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
