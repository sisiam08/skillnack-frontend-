import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, CalendarCheck2, CheckCircle2 } from "lucide-react";
import TakaIcon from "@/components/shared/TakaIcon";
import Link from "next/link";
import { format } from "date-fns";
import { StudentService } from "@/service/student.service";
import { StudentStats, StudentRecentActivity } from "@/types";
import { BarChart, TrendLineChart } from "@/components/charts";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const statsResponse = await StudentService.getStudentStats();
  const studentStats: StudentStats = statsResponse.data?.data ?? {
    totalBookings: 0,
    monthlyBookings: 0,
    completedSessions: 0,
    completionRate: 0,
    totalSpent: 0,
    refundableAmount: 0,
    spendByMonth: [],
    sessionsByCategory: [],
  };

  const recentActivityResponse =
    await StudentService.getStudentRecentActivity();
  const studentRecentActivity: StudentRecentActivity = recentActivityResponse
    .data?.data ?? {
    recentSession: {},
    recentReview: {},
    recentBooking: {},
  };

  const overviewStats = [
    {
      title: "Total Bookings",
      value: `${studentStats.totalBookings}`,
      note: `${studentStats.monthlyBookings} this month`,
      icon: CalendarCheck2,
    },
    {
      title: "Completed Sessions",
      value: `${studentStats.completedSessions}`,
      note: `${studentStats.completionRate.toFixed(1)}% completion rate`,
      icon: CheckCircle2,
    },
    {
      title: "Learning Spend",
      value: `৳ ${studentStats.totalSpent}`,
      note: "Across all bookings",
      icon: TakaIcon,
    },
    {
      title: "Refundable Amount",
      value: `৳ ${studentStats.refundableAmount}`,
      note: "Across cancelled bookings",
      icon: TakaIcon,
    },
  ];

  const recentActivity = [
    Object.keys(studentRecentActivity.recentSession || {}).length > 0
      ? {
          title: "Session Completed",
          description: `${studentRecentActivity.recentSession.categoryName} with ${studentRecentActivity.recentSession.tutorName}`,
          time: studentRecentActivity.recentSession.timeAgo ?? "-",
        }
      : null,
    Object.keys(studentRecentActivity.recentReview || {}).length > 0
      ? {
          title: "Review Submitted",
          description: `You rated ${studentRecentActivity.recentReview.tutorName} ${studentRecentActivity.recentReview.rating} stars`,
          time: studentRecentActivity.recentReview.timeAgo ?? "-",
        }
      : null,
    Object.keys(studentRecentActivity.recentBooking || {}).length > 0
      ? {
          title: "Booking Confirmed",
          description: `${studentRecentActivity.recentBooking.categoryName} on ${format(new Date(studentRecentActivity.recentBooking.sessionDate ?? ""), "PPP")}`,
          time: studentRecentActivity.recentBooking.timeAgo ?? "-",
        }
      : null,
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="overflow-hidden border-border/70 bg-linear-to-r from-amber-50 via-white to-orange-50 dark:from-card dark:via-card dark:to-card">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="ui-title-panel">
                Student Dashboard
              </CardTitle>
              <CardDescription className="mt-2">
                Snapshot of your learning activity.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={"/find-tutors"}>
                <Button className="bg-brand py-4 text-white hover:bg-brand-strong">
                  Book New Session
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((item, idx) => (
          <Card
            key={item.title}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${idx * 90}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.title}
                </p>
                <item.icon
                  className="size-4 text-brand"
                  suppressHydrationWarning
                />
              </div>
              <p className="mt-2 ui-stat-value">{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Learning Spend</CardTitle>
            <CardDescription>
              Paid spend over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={studentStats.spendByMonth}
              xKey="month"
              series={[
                { key: "amount", label: "Spent (৳)", color: "var(--brand)" },
              ]}
              valueFormat="taka"
              emptyMessage="No payments yet"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Sessions by Category</CardTitle>
            <CardDescription>Where your learning is focused</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={studentStats.sessionsByCategory}
              xKey="category"
              series={[
                { key: "count", label: "Sessions", color: "var(--chart-2)" },
              ]}
              horizontal
              emptyMessage="No sessions yet"
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenCheck
                className="size-4 text-brand"
                suppressHydrationWarning
              />
              Recent Activity
            </CardTitle>
            <CardDescription>
              What happened in your learning timeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.every((value) => value === null) ? (
              <p className="text-sm text-muted-foreground">
                No recent activity to display.
              </p>
            ) : (
              recentActivity.map((activity) =>
                activity ? (
                  <div
                    key={`${activity.title}-${activity.time}`}
                    className="flex items-start justify-between gap-3 rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <Badge variant="outline">{activity.time}</Badge>
                  </div>
                ) : null,
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
