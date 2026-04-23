"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
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
import Link from "next/link";

export function AppSidebar({
  user,
  ...props
}: {
  user: { role: string } & React.ComponentProps<typeof Sidebar>;
}) {
  const router = useRouter();
  let routes: Routes = { items: [] };

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

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href={"/"}>
          <div className="flex items-center gap-3 pt-2 pb-6 pl-2">
            <div className="size-9 bg-brand rounded-lg flex items-center justify-center text-white">
              <GraduationCap
                className="size-5"
                strokeWidth={2.2}
                suppressHydrationWarning
              />
            </div>

            <span className="ui-title-brand">SkillBridge</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {routes.items.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarMenu>
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild title={item.title}>
                  <a href={item.url}>{item.title}</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
