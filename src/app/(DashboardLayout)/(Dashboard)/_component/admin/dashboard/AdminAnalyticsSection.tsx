import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, DonutChart, ScatterPlot, TrendLineChart } from "@/components/charts";
import { formatTaka } from "@/components/charts/chart-types";
import type { AdminAnalytics } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "var(--chart-4)",
  CONFIRMED: "var(--chart-2)",
  RUNNING: "var(--chart-3)",
  COMPLETED: "var(--chart-1)",
  CANCELLED: "var(--chart-5)",
};

export default function AdminAnalyticsSection({
  analytics,
  tutorAccountStatus,
  avgBookingsPerTutor,
  reviewRate,
}: {
  analytics: AdminAnalytics;
  tutorAccountStatus: { active: number; banned: number };
  avgBookingsPerTutor: number;
  reviewRate: number;
}) {
  const { revenue, bookings, userGrowth } = analytics;

  const metricCards = [
    {
      title: "GMV (collected)",
      value: formatTaka(revenue.gmv),
      note: `${revenue.paidBookings} paid bookings`,
    },
    {
      title: "Platform Commission",
      value: formatTaka(revenue.commission),
      note: "10% of GMV",
    },
    {
      title: "Tutor Payout Owed",
      value: formatTaka(revenue.tutorPayout),
      note: "90% of GMV",
    },
    {
      title: "Avg. Booking Value",
      value: formatTaka(revenue.avgBookingValue),
      note: "Per paid booking",
    },
    {
      title: "Platform Solve Rate",
      value: `${analytics.solveRate.rate}%`,
      note: `${analytics.solveRate.solved}/${analytics.solveRate.total} outcomes recorded`,
    },
    {
      title: "Active Tutors",
      value: `${analytics.activeTutors.active}/${analytics.activeTutors.total}`,
      note: `Booked in last ${analytics.activeTutors.windowDays} days`,
    },
  ];

  const bookingStatusData = (
    Object.keys(bookings.statusCounts) as (keyof typeof bookings.statusCounts)[]
  ).map((status) => ({ name: status, value: bookings.statusCounts[status] }));

  const tutorFunnelData = [
    { name: "Pending", value: analytics.tutorFunnel.PENDING },
    { name: "Approved", value: analytics.tutorFunnel.APPROVED },
    { name: "Rejected", value: analytics.tutorFunnel.REJECTED },
  ];

  // Ban status (User axis) — distinct from verification status (TutorProfiles
  // axis). Composition of tutor accounts: active vs banned.
  const tutorAccountStatusData = [
    { name: "Active", value: tutorAccountStatus.active },
    { name: "Banned", value: tutorAccountStatus.banned },
  ];
  const tutorAccountTotal = tutorAccountStatus.active + tutorAccountStatus.banned;
  const banRate =
    tutorAccountTotal > 0
      ? (tutorAccountStatus.banned / tutorAccountTotal) * 100
      : 0;

  const goalSplitData = analytics.goalSplit.map((item) => ({
    name: item.goalType === "SOLVE_PROBLEM" ? "Solve a problem" : item.goalType === "LEARN_TOPIC" ? "Learn a topic" : "Unspecified",
    value: item.count,
  }));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="ui-title-card">Business Analytics</h2>
        <span className="text-xs text-muted-foreground">
          Range: {analytics.range.key}
          {analytics.range.isMonthly ? " (monthly buckets)" : " (daily buckets)"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metricCards.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {metric.title}
              </p>
              <p className="mt-2 ui-stat-value">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Revenue Collected</CardTitle>
            <CardDescription>
              Platform commission vs tutor payout, by collection date
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart
              data={revenue.series}
              xKey="label"
              stacked
              series={[
                {
                  key: "commission",
                  label: "Commission",
                  color: "var(--chart-1)",
                },
                { key: "payout", label: "Tutor payout", color: "var(--chart-2)" },
              ]}
              valueFormat="taka"
              emptyMessage="No payments collected in this range"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Composition of bookings created</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <DonutChart
              data={bookingStatusData}
              nameKey="name"
              valueKey="value"
              colors={bookingStatusData.map((item) => statusColors[item.name])}
              valueFormat="number"
              emptyMessage="No bookings in this range"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>New Signups</CardTitle>
          <CardDescription>Students vs tutors over time</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <TrendLineChart
            data={userGrowth.series}
            xKey="label"
            series={[
              { key: "students", label: "Students", color: "var(--chart-1)" },
              { key: "tutors", label: "Tutors", color: "var(--chart-3)" },
            ]}
            emptyMessage="No signups in this range"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tutors by Verification Status</CardTitle>
            <CardDescription>TutorProfiles by verification status</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <DonutChart
              data={tutorFunnelData}
              nameKey="name"
              valueKey="value"
              colors={["var(--chart-4)", "var(--chart-2)", "var(--chart-5)"]}
              valueFormat="number"
              emptyMessage="No tutor applications yet"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tutor Account Status</CardTitle>
            <CardDescription>Active vs banned tutor accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <DonutChart
              data={tutorAccountStatusData}
              nameKey="name"
              valueKey="value"
              colors={["var(--chart-2)", "var(--destructive)"]}
              valueFormat="number"
              emptyMessage="No tutor accounts yet"
            />
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                Ban rate: {banRate.toFixed(1)}% ({tutorAccountStatus.banned} of{" "}
                {tutorAccountTotal} tutor accounts)
              </p>
              <p>
                Avg. {avgBookingsPerTutor.toFixed(1)} bookings per tutor account
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Booking Funnel</CardTitle>
            <CardDescription>
              Created → paid → completed, for bookings created in range
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <BarChart
              data={bookings.funnel}
              xKey="stage"
              horizontal
              series={[
                { key: "count", label: "Bookings", color: "var(--chart-1)" },
              ]}
              valueFormat="number"
              emptyMessage="No bookings in this range"
            />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Paid conversion: {bookings.paidConversionRate}%</span>
              <span>Completion: {bookings.completionRate}%</span>
              <span>Cancellation: {bookings.cancellationRate}%</span>
              <span>Avg. duration: {bookings.avgSessionMinutes} min</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: expired or abandoned Stripe checkout sessions are
              hard-deleted and never counted, so these rates reflect persisted
              bookings only — not every checkout attempt.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Booking Intent</CardTitle>
            <CardDescription>Goal type split</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <DonutChart
              data={goalSplitData}
              nameKey="name"
              valueKey="value"
              valueFormat="number"
              emptyMessage="No goal data in this range"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Bookings by Category (Demand)</CardTitle>
            <CardDescription>
              Booking volume per tutor category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart
              data={analytics.demandByCategory}
              xKey="category"
              horizontal
              series={[
                { key: "bookings", label: "Bookings", color: "var(--chart-1)" },
              ]}
              valueFormat="number"
              emptyMessage="No bookings in this range"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Approved Tutors by Category (Supply)</CardTitle>
            <CardDescription>Tutor coverage per category</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart
              data={analytics.supplyByCategory}
              xKey="category"
              horizontal
              series={[
                { key: "tutors", label: "Tutors", color: "var(--chart-2)" },
              ]}
              valueFormat="number"
              emptyMessage="No approved tutors yet"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Hourly Rate Distribution</CardTitle>
            <CardDescription>Approved tutors by rate (৳)</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart
              data={analytics.hourlyRateDistribution}
              xKey="bucket"
              series={[
                { key: "count", label: "Tutors", color: "var(--chart-3)" },
              ]}
              valueFormat="number"
              emptyMessage="No approved tutors yet"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Rating vs Completed Bookings</CardTitle>
            <CardDescription>
              Each point is an approved tutor with reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ScatterPlot
              data={analytics.ratingVsCompleted.map((tutor) => ({
                x: tutor.completed,
                y: tutor.rating,
                label: tutor.name,
              }))}
              xLabel="Completed bookings"
              yLabel="Average rating"
              yFormat="decimal1"
              emptyMessage="Not enough rated tutors yet"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Top Tutors</CardTitle>
            <CardDescription>By collected revenue in range</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {analytics.topTutors.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No paid bookings in this range.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tutor</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topTutors.map((tutor) => (
                    <TableRow key={tutor.name}>
                      <TableCell className="font-medium">{tutor.name}</TableCell>
                      <TableCell className="text-right">
                        {formatTaka(tutor.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {tutor.paidBookings}
                      </TableCell>
                      <TableCell className="text-right">
                        {tutor.completed}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>All reviews by star rating</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart
              data={analytics.ratingDistribution.map((item) => ({
                rating: `${item.rating}★`,
                count: item.count,
              }))}
              xKey="rating"
              series={[
                { key: "count", label: "Reviews", color: "var(--chart-4)" },
              ]}
              valueFormat="number"
              emptyMessage="No reviews yet"
            />
            <p className="pt-2 text-xs text-muted-foreground">
              Review rate: {reviewRate.toFixed(1)}% of bookings received a review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Subjects Offered (Supply)</CardTitle>
            <CardDescription>Tutors per subject</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {analytics.supplyBySubject.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No subjects linked to tutors yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Tutors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.supplyBySubject.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.tutors}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Skills Offered (Supply)</CardTitle>
            <CardDescription>Tutors per skill</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {analytics.supplyBySkill.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No skills linked to tutors yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead className="text-right">Tutors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.supplyBySkill.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.tutors}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
