import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  UserX,
  BookOpen,
  Calendar,
  Star,
} from "lucide-react";
import { AdminDashboardStats } from "@/types";
import { AdminService } from "@/service/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const statsResponse = await AdminService.getAdminDashboardStats();
  const stats: AdminDashboardStats = statsResponse.data?.data ?? {
    totalUsers: 0,
    totalTutors: 0,
    bannedTutors: 0,
    totalStudents: 0,
    totalBookings: 0,
    totalBookingsCompleted: 0,
    totalBookingsCancelled: 0,
    totalReviews: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "All registered users",
      icon: Users,
    },
    {
      title: "Total Tutors",
      value: stats.totalTutors,
      description: "Active tutor profiles",
      icon: GraduationCap,
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      description: "Registered students",
      icon: BookOpen,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      description: "All time bookings",
      icon: Calendar,
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      description: "Tutor reviews submitted",
      icon: Star,
    },
    {
      title: "Banned Tutors",
      value: stats.bannedTutors,
      description: "Suspended accounts",
      icon: UserX,
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue}`,
      description: "All time earnings",
      icon: Star,
    },
    {
      title: "Monthly Revenue",
      value: `৳${stats.monthlyRevenue}`,
      description: "Current month earnings",
      icon: Star,
    },
    {
      title: "Completed Bookings",
      value: stats.totalBookingsCompleted,
      description: "Successfully completed",
      icon: Calendar,
    },
    {
      title: "Cancelled Bookings",
      value: stats.totalBookingsCancelled,
      description: "Cancelled sessions",
      icon: UserX,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="overflow-hidden border-border/70 bg-linear-to-r from-orange-50 via-white to-amber-50 dark:from-card dark:via-card dark:to-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="ui-title-panel">Admin Dashboard</CardTitle>
            <CardDescription>
              Overview of your tutoring platform statistics and metrics.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.title}
                  </p>
                  <Icon className="size-4 text-brand shrink-0" />
                </div>
                <p className="mt-2 ui-stat-value">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden [animation-delay:400ms]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <CardDescription className="text-xs">
              Platform health indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Active Tutors
              </span>
              <Badge variant="outline" className="font-normal text-xs">
                {stats.totalTutors - stats.bannedTutors} Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Tutor Ban Rate
              </span>
              <Badge variant="outline" className="font-normal text-xs">
                {stats.totalTutors > 0
                  ? ((stats.bannedTutors / stats.totalTutors) * 100).toFixed(1)
                  : 0}
                %
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Avg. Bookings per Tutor
              </span>
              <Badge variant="outline" className="font-normal text-xs">
                {stats.totalTutors > 0
                  ? (stats.totalBookings / stats.totalTutors).toFixed(1)
                  : 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Review Rate
              </span>
              <Badge variant="outline" className="font-normal text-xs">
                {stats.totalBookings > 0
                  ? ((stats.totalReviews / stats.totalBookings) * 100).toFixed(
                      1,
                    )
                  : 0}
                %
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Completion Rate
              </span>
              <Badge variant="outline" className="font-normal text-xs">
                {stats.totalBookings > 0
                  ? (
                      (stats.totalBookingsCompleted / stats.totalBookings) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Cancellation Rate
              </span>
              <Badge variant="outline" className="font-normal text-xs">
                {stats.totalBookings > 0
                  ? (
                      (stats.totalBookingsCancelled / stats.totalBookings) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Avg Revenue per Booking
              </span>
              <Badge variant="outline" className="font-normal text-xs">
                ৳
                {stats.totalBookings > 0
                  ? (stats.totalRevenue / stats.totalBookings).toFixed(0)
                  : 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden [animation-delay:460ms]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Platform Overview</CardTitle>
            <CardDescription className="text-xs">
              Key performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Student to Tutor Ratio
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {stats.totalTutors > 0
                    ? (
                        stats.totalStudents /
                        (stats.totalTutors - stats.bannedTutors)
                      ).toFixed(1)
                    : 0}
                  :1
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-brand"
                  style={{
                    width: `${Math.min((stats.totalStudents / stats.totalUsers) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Booking Completion
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {stats.totalBookings > 0
                    ? (
                        (stats.totalBookingsCompleted / stats.totalBookings) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div
                className="h-2 rounded-full bg-green-600"
                style={{
                  width: `${
                    stats.totalBookings > 0
                      ? (stats.totalBookingsCompleted / stats.totalBookings) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Monthly Revenue Growth
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  ৳{stats.monthlyRevenue}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-purple-600"
                  style={{
                    width: `${Math.min(
                      (stats.monthlyRevenue / (stats.totalRevenue || 1)) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
