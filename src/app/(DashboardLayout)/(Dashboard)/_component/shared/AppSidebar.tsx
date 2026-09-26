"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Routes } from "@/types";
import { UserRole } from "@/constants/roles";
import { AdminRoutes } from "@/routes/adminRoutes";
import { StudentRoutes } from "@/routes/studentRoutes";
import { TutorRoutes } from "@/routes/tutorRoutes";
import { authClient } from "@/lib/auth-client";
import Logo from "./Logo";

export function AppSidebar({
  user,
  ...props
}: {
  user: { role: string } & React.ComponentProps<typeof Sidebar>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  let routes: Routes = { items: [] };

  // Root dashboard routes must match exactly; nested routes match by prefix so
  // e.g. /dashboard/history/abc highlights "History" but /dashboard itself does
  // not get highlighted while on /dashboard/history.
  const isItemActive = (url: string) => {
    const isDashboardRoot =
      url === "/dashboard" ||
      url === "/tutor-dashboard" ||
      url === "/admin-dashboard";

    if (isDashboardRoot) {
      return pathname === url;
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  switch (user.role) {
    case UserRole.ADMIN:
      routes = AdminRoutes;
      break;
    case UserRole.TUTOR:
      routes = TutorRoutes;
      break;
    case UserRole.STUDENT:
      routes = StudentRoutes;
      break;

    default:
      routes = { items: [] };
      break;
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {routes.items.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarMenu>
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isItemActive(item.url)}
                  title={item.title}
                  className="data-[active=true]:bg-brand/10 data-[active=true]:text-brand data-[active=true]:font-semibold data-[active=true]:shadow-[inset_2px_0_0_0_var(--brand)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <a href={item.url}>
                    {item.icon ? <item.icon /> : null}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-2 bg-brand/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              title="Logout"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <LogOut suppressHydrationWarning />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
