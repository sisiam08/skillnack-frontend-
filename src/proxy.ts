import { UserRole } from "@/constants/roles";
import { UserService } from "@/service/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  let isAuthenticated = false;

  const { data } = await UserService.getSession();

  if (data) {
    isAuthenticated = true;
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const roleRoutes = {
    [UserRole.ADMIN]: "/admin-dashboard",
    [UserRole.TUTOR]: "/tutor-dashboard",
    [UserRole.STUDENT]: "/dashboard",
  };

  const allowedBasePath = roleRoutes[data?.user?.role as UserRole];

  if (!pathName.startsWith(allowedBasePath)) {
    return NextResponse.redirect(new URL(allowedBasePath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/tutor-dashboard",
    "/tutor-dashboard/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
