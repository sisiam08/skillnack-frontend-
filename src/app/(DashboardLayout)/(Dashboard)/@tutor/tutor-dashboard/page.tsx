import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TutorService } from "@/service/tutor.service";
import { TutorStats } from "@/types";
import { BarChart, DonutChart, TrendLineChart } from "@/components/charts";
import { format } from "date-fns";
import {
  Banknote,
  CalendarClock,
  Star,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TutorDashboardPage() {
  const statsResponse = await TutorService.getTutorStats();
  const earningsResponse = await TutorService.getWeeklyEarnings();

  const stats: TutorStats = statsResponse.data?.data ?? {
    earnings: {
      totalEarnings: 0,
      earningsThisMonth: 0,
      earningsToday: 0,
      hourlyRate: 0,
    },
    profile: {
      uniqueStudents: 0,
      experienceYears: 0,
      activeDays: 0,
      averageRating: 0,
      totalRatings: 0,
      reviewCount: 0,
    },
    sessions: {
      completed: 0,
      completedToday: 0,
      completedThisWeek: 0,
      cancelled: 0,
      cancelledThisMonth: 0,
      upcoming: 0,
    },
    outcomes: {
      solved: 0,
      partiallySolved: 0,
      notSolved: 0,
    },
    ratingTrend: [],
  };

  const weeklyEarnings: { weekDay: string; earnings: number }[] =
    earningsResponse.data?.data ?? [];

  const earningsStats = [
    {
      title: "Total Earnings",
      value: `৳ ${stats.earnings.totalEarnings ?? 0}`,
      note: "All time earnings",
      icon: Banknote,
    },
    {
      title: "Monthly Earnings",
      value: `৳ ${stats.earnings.earningsThisMonth ?? 0}`,
      note: `${format(new Date(), "MMMM, yyyy")} earnings`,
      icon: TrendingUp,
    },
    {
      title: "Today's Earnings",
      value: `৳ ${stats.earnings.earningsToday ?? 0}`,
      note: `${stats.sessions.completedToday ?? 0} sessions today`,
      icon: CalendarClock,
    },
    {
      title: "Hourly Rate",
      value: `৳ ${stats.earnings.hourlyRate ?? 0}`,
      note: "Per session hour",
      icon: Banknote,
    },
  ];

  const profileStats = [
    {
      title: "Total Unique Students",
      value: `${stats.profile.uniqueStudents ?? 0}`,
      note: "Students taught all time",
      icon: UserRoundCheck,
    },
    {
      title: "Experience",
      value: `${stats.profile.experienceYears ?? 0} yrs`,
      note: "Years of teaching",
      icon: TrendingUp,
    },
    {
      title: "Active Availability",
      value: `${stats.profile.activeDays ?? 0} days`,
      note: "Days open per week",
      icon: CalendarClock,
    },
    {
      title: "Average Rating",
      value: `${stats.profile.averageRating ?? 0} / 5`,
      note: `Based on ${stats.profile.reviewCount ?? 0} reviews`,
      icon: Star,
    },
  ];

  const sessionStats = [
    {
      title: "Completed Sessions",
      value: `${stats.sessions.completed ?? 0}`,
      note: `${stats.sessions.completedThisWeek ?? 0} this week`,
      icon: UserRoundCheck,
    },
    {
      title: "Cancelled Sessions",
      value: `${stats.sessions.cancelled ?? 0}`,
      note: `${stats.sessions.cancelledThisMonth ?? 0} this month`,
      icon: CalendarClock,
    },
    {
      title: "Upcoming Sessions",
      value: `${stats.sessions.upcoming ?? 0}`,
      note: "Confirmed sessions in today and future",
      icon: TrendingUp,
    },
  ];

  const outcomeData = [
    { name: "Solved", value: stats.outcomes.solved },
    { name: "Partially solved", value: stats.outcomes.partiallySolved },
    { name: "Not solved", value: stats.outcomes.notSolved },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="overflow-hidden border-border/70 bg-linear-to-r from-orange-50 via-white to-amber-50 dark:from-card dark:via-card dark:to-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="ui-title-panel">Tutor Dashboard</CardTitle>
            <CardDescription>
              Track your sessions, earnings, and student engagement.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-brand text-white hover:bg-brand">
              {stats.sessions.upcoming ?? 0} Upcoming
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {earningsStats.map((item, idx) => (
          <Card
            key={item.title}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {item.title}
                  </p>
                  <p className="mt-2 ui-stat-value">{item.value}</p>
                </div>
                <item.icon className="size-4 text-brand" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {profileStats.map((item, idx) => (
          <Card
            key={item.title}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden"
            style={{ animationDelay: `${idx * 90}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {item.title}
                  </p>
                  <p className="mt-2 ui-stat-value">{item.value}</p>
                </div>
                <item.icon className="size-4 text-brand" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Weekly Earnings</CardTitle>
            <CardDescription>This week&apos;s earnings by day</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart
              data={weeklyEarnings}
              xKey="weekDay"
              series={[
                {
                  key: "earnings",
                  label: "Earnings (৳)",
                  color: "var(--brand)",
                },
              ]}
              valueFormat="taka"
              emptyMessage="No earnings this week"
            />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Session Outcomes</CardTitle>
            <CardDescription>How your sessions are resolving</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <DonutChart
              data={outcomeData}
              nameKey="name"
              valueKey="value"
              colors={["var(--chart-2)", "var(--chart-4)", "var(--chart-5)"]}
              valueFormat="number"
              emptyMessage="No session outcomes recorded yet"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Rating Trend</CardTitle>
            <CardDescription>Average review rating by month</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <TrendLineChart
              data={stats.ratingTrend}
              xKey="month"
              series={[
                {
                  key: "averageRating",
                  label: "Avg. rating",
                  color: "var(--chart-3)",
                },
              ]}
              valueFormat="decimal1"
              emptyMessage="Not enough review history yet"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:col-span-3">
          {sessionStats.map((item, idx) => (
            <Card
              key={item.title}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {item.title}
                    </p>
                    <p className="mt-2 ui-stat-value">{item.value}</p>
                  </div>
                  <item.icon className="size-4 text-brand" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.note}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
