import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AdminAnalytics, AdminAnalyticsRange, AdminDashboardStats } from "@/types";
import { AdminService } from "@/service/admin.service";
import { DonutChart } from "@/components/charts";
import AdminAnalyticsSection from "../../_component/admin/dashboard/AdminAnalyticsSection";

export const dynamic = "force-dynamic";

const RANGE_OPTIONS: { key: AdminAnalyticsRange; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "12m", label: "12 months" },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const activeRange: AdminAnalyticsRange = RANGE_OPTIONS.some(
    (option) => option.key === range,
  )
    ? (range as AdminAnalyticsRange)
    : "30d";

  const statsResponse = await AdminService.getAdminDashboardStats();
  const analyticsResponse = await AdminService.getAdminAnalytics(activeRange);
  const analytics: AdminAnalytics | null =
    analyticsResponse.data?.data ?? null;

  const stats: AdminDashboardStats = statsResponse.data?.data ?? {
    totalUsers: 0,
    totalTutors: 0,
    bannedTutors: 0,
    totalStudents: 0,
    totalBookings: 0,
    totalReviews: 0,
  };

  // Role composition — the donut is the only place the tutor/student counts
  // live (its legend shows exact counts and its centre shows the total).
  const roleData = [
    { name: "Students", value: stats.totalStudents },
    { name: "Tutors", value: stats.totalTutors },
    {
      name: "Admins",
      value: Math.max(
        stats.totalUsers - stats.totalStudents - stats.totalTutors,
        0,
      ),
    },
  ];

  const activeTutors = Math.max(stats.totalTutors - stats.bannedTutors, 0);
  const avgBookingsPerTutor =
    stats.totalTutors > 0 ? stats.totalBookings / stats.totalTutors : 0;
  const reviewRate =
    stats.totalBookings > 0
      ? (stats.totalReviews / stats.totalBookings) * 100
      : 0;

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

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Users by Role</CardTitle>
          <CardDescription className="text-xs">
            Composition of all registered accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={roleData}
            nameKey="name"
            valueKey="value"
            valueFormat="number"
            centerValue={String(stats.totalUsers)}
            centerLabel="Total Users"
            emptyMessage="No users yet"
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Period:</span>
        {RANGE_OPTIONS.map((option) => (
          <Link
            key={option.key}
            href={`/admin-dashboard?range=${option.key}`}
            className={
              option.key === activeRange
                ? "rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white"
                : "rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
            }
          >
            {option.label}
          </Link>
        ))}
      </div>

      {analytics ? (
        <AdminAnalyticsSection
          analytics={analytics}
          tutorAccountStatus={{
            active: activeTutors,
            banned: stats.bannedTutors,
          }}
          avgBookingsPerTutor={avgBookingsPerTutor}
          reviewRate={reviewRate}
        />
      ) : null}
    </div>
  );
}
