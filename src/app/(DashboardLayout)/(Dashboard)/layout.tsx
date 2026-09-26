import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserRole } from "@/constants/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppSidebar } from "./_component/shared/AppSidebar";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { UserService } from "@/service/user.service";

const DEFAULT_AVATAR = "/default-avatar-profile.jpg";

export default async function DashboardLayout({
  admin,
  tutor,
  student,
}: {
  admin: React.ReactNode;
  tutor: React.ReactNode;
  student: React.ReactNode;
}) {
  const session = await UserService.getSession();
  const userInfo = session?.data?.user;

  if (!userInfo) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 dark:bg-[rgb(23,23,23)]">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />
            <ModeToggle />
          </div>
          <Link
            href={
              userInfo.role === UserRole.STUDENT
                ? "dashboard/profile"
                : "/tutor-dashboard/tutor-profile"
            }
          >
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-md font-medium leading-none">
                  {userInfo.name}
                </p>
              </div>
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={userInfo.image || DEFAULT_AVATAR}
                  alt={userInfo.name || "User Avatar"}
                />
                <AvatarFallback>
                  {userInfo.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
        </header>
        <div className="flex flex-1 flex-col dark:bg-[#111214] gap-4 p-4 sm:px-6 lg:px-8">
          {userInfo.role === UserRole.ADMIN
            ? admin
            : userInfo.role == UserRole.TUTOR
              ? tutor
              : student}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
