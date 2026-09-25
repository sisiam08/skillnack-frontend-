import { Fragment, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Star,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import {
  Bookings,
  BookingsFilters,
  PaginationType,
  SessionOutcome,
} from "@/types";
import { BookingStatus } from "@/constants/status";
import { convertInto12h } from "@/helpers/TimeHelpers";
import { format } from "date-fns";
import { UserRole } from "@/constants/roles";
import RenderStars from "@/components/shared/renderStars";
import Pagination from "@/components/shared/Pagination";

type BookingsHistoryProps = {
  role: UserRole;
  bookings: Bookings[];
  pagination: PaginationType;
  filters: BookingsFilters;
  setFilters: (filters: BookingsFilters) => void;
  expandedReview: string | null;
  setExpandedReview: (bookingId: string | null) => void;
};

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Confirmed
        </Badge>
      );
    case BookingStatus.COMPLETED:
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case BookingStatus.CANCELLED:
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      );
    case BookingStatus.RUNNING:
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Activity className="mr-1 h-3 w-3" />
          Running
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          {status}
        </Badge>
      );
  }
};

const getAttachmentName = (url: string) => {
  try {
    const decoded = decodeURIComponent(url.split("/").pop() ?? "attachment");
    const withoutPrefix = decoded.replace(/^[a-z0-9]+-\d+-/i, "");
    return withoutPrefix.length > 28
      ? `${withoutPrefix.slice(0, 25)}...`
      : withoutPrefix;
  } catch {
    return "attachment";
  }
};

const getOutcomeBadge = (outcome: SessionOutcome) => {
  switch (outcome) {
    case "SOLVED":
      return (
        <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Solved
        </Badge>
      );
    case "PARTIALLY_SOLVED":
      return (
        <Badge className="mt-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Activity className="mr-1 h-3 w-3" />
          Partially solved
        </Badge>
      );
    case "NOT_SOLVED":
      return (
        <Badge className="mt-1 bg-red-600 text-white hover:bg-red-600">
          <XCircle className="mr-1 h-3 w-3" />
          Not solved
        </Badge>
      );
    default:
      return null;
  }
};

export default function BookingsHistory({
  role,
  bookings,
  pagination,
  filters,
  setFilters,
  expandedReview,
  setExpandedReview,
}: BookingsHistoryProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const totalColumns =
    7 + (role !== UserRole.STUDENT ? 1 : 0) + (role !== UserRole.TUTOR ? 1 : 0);

  const toggleReview = (bookingId: string) => {
    setExpandedReview(expandedReview === bookingId ? null : bookingId);
  };

  const toggleRequest = (bookingId: string) => {
    setExpandedRequest(expandedRequest === bookingId ? null : bookingId);
  };

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === pagination.page
    ) {
      return;
    }

    setFilters({
      ...filters,
      page: String(nextPage),
    });
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters({
      ...filters,
      limit: String(newLimit),
      page: "1",
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="ui-title-panel">
              {role === UserRole.STUDENT
                ? "Your Bookings"
                : role === UserRole.TUTOR
                  ? "All Sessions"
                  : "All Bookings"}{" "}
              Overview
            </CardTitle>
            <CardDescription>
              {role === UserRole.STUDENT
                ? "Monitor your bookings"
                : role === UserRole.TUTOR
                  ? "Monitor tutoring sessions"
                  : "Monitor and manage all tutoring sessions"}{" "}
              on the platform.
            </CardDescription>
          </div>
          <Badge className="bg-brand text-white hover:bg-brand">
            {pagination.totalData}{" "}
            {filters.status === BookingStatus.PENDING
              ? "Pending"
              : filters.status === BookingStatus.CONFIRMED
                ? "Confirmed"
                : filters.status === BookingStatus.COMPLETED
                  ? "Completed"
                  : filters.status === BookingStatus.CANCELLED
                    ? "Cancelled"
                    : filters.status === BookingStatus.RUNNING
                      ? "Running"
                      : "Bookings"}
          </Badge>
        </CardHeader>
      </Card>

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:240ms]">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter bookings by status or search</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.status === undefined ? "default" : "outline"}
              onClick={() =>
                setFilters({ ...filters, status: undefined, page: "1" })
              }
              className={
                filters.status === undefined
                  ? "bg-brand hover:bg-brand-strong dark:text-white"
                  : ""
              }
            >
              All
            </Button>
            <Button
              variant={
                filters.status === BookingStatus.CONFIRMED
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setFilters({
                  ...filters,
                  status: BookingStatus.CONFIRMED,
                  page: "1",
                })
              }
              className={
                filters.status === BookingStatus.CONFIRMED
                  ? "bg-brand hover:bg-brand-strong dark:text-white"
                  : ""
              }
            >
              Confirmed
            </Button>
            {role === UserRole.ADMIN ? (
              <Button
                variant={
                  filters.status === BookingStatus.PENDING
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setFilters({
                    ...filters,
                    status: BookingStatus.PENDING,
                    page: "1",
                  })
                }
                className={
                  filters.status === BookingStatus.PENDING
                    ? "bg-brand hover:bg-brand-strong dark:text-white"
                    : ""
                }
              >
                Pending
              </Button>
            ) : null}
            <Button
              variant={
                filters.status === BookingStatus.COMPLETED
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setFilters({
                  ...filters,
                  status: BookingStatus.COMPLETED,
                  page: "1",
                })
              }
              className={
                filters.status === BookingStatus.COMPLETED
                  ? "bg-brand hover:bg-brand-strong dark:text-white"
                  : ""
              }
            >
              Completed
            </Button>
            <Button
              variant={
                filters.status === BookingStatus.CANCELLED
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setFilters({
                  ...filters,
                  status: BookingStatus.CANCELLED,
                  page: "1",
                })
              }
              className={
                filters.status === BookingStatus.CANCELLED
                  ? "bg-brand hover:bg-brand-strong dark:text-white"
                  : ""
              }
            >
              Cancelled
            </Button>
            <Button
              variant={
                filters.status === BookingStatus.RUNNING ? "default" : "outline"
              }
              onClick={() =>
                setFilters({
                  ...filters,
                  status: BookingStatus.RUNNING,
                  page: "1",
                })
              }
              className={
                filters.status === BookingStatus.RUNNING
                  ? "bg-brand hover:bg-brand-strong dark:text-white"
                  : ""
              }
            >
              Running
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:280ms]">
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            Complete list of tutoring sessions with details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="rounded-md border bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
              No bookings found matching your filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-225 lg:min-w-full">
                <TableHeader>
                  <TableRow>
                    {role !== UserRole.STUDENT ? (
                      <TableHead className="text-center">Student</TableHead>
                    ) : null}
                    {role !== UserRole.TUTOR ? (
                      <TableHead className="text-center">Tutor</TableHead>
                    ) : null}
                    <TableHead className="text-center">Category</TableHead>
                    <TableHead className="text-center">Request</TableHead>
                    <TableHead className="text-center">Session Date</TableHead>
                    <TableHead className="text-center">Session Time</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Reviews</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <Fragment key={booking.id}>
                      <TableRow>
                        {role !== UserRole.STUDENT ? (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={booking.student?.image} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                  {booking.student?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {booking.student?.name}
                              </span>
                            </div>
                          </TableCell>
                        ) : null}

                        {role !== UserRole.TUTOR ? (
                          <TableCell className="text-center">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={booking.tutor?.user?.image} />
                                <AvatarFallback className="bg-brand/10 text-brand text-xs">
                                  {booking.tutor?.user?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {booking.tutor?.user?.name}
                              </span>
                            </div>
                          </TableCell>
                        ) : null}

                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {booking.tutor?.category?.name ?? "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {booking.title || booking.description ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleRequest(booking.id)}
                              className="gap-1"
                            >
                              <span className="max-w-32 truncate">
                                {booking.title || "View request"}
                              </span>
                              {expandedRequest === booking.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No details
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {format(new Date(booking.sessionDate), "PP")}
                        </TableCell>
                        <TableCell className="text-center">
                          {convertInto12h(booking.startTime)} -{" "}
                          {convertInto12h(booking.endTime)}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          ৳{booking.price}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            {getStatusBadge(booking.status as BookingStatus)}
                            {booking.outcome
                              ? getOutcomeBadge(booking.outcome)
                              : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {booking.reviews ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleReview(booking.id)}
                              className="gap-1"
                            >
                              <span className="flex items-center gap-1">
                                {booking.reviews.rating}
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              </span>
                              {expandedReview === booking.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No review
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedReview === booking.id && booking.reviews && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={totalColumns} className="p-4">
                            <div className="flex items-start gap-4 rounded-lg border bg-background p-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                                <MessageSquare className="h-5 w-5 text-brand" />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold">
                                      Review from {booking.student?.name}
                                    </span>
                                    <RenderStars
                                      rating={booking.reviews.rating}
                                    />
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {booking.reviews.rating}/5
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {booking.reviews.comment ||
                                    "No comment provided."}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}

                      {expandedRequest === booking.id &&
                        (booking.title || booking.description) && (
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={totalColumns} className="p-4">
                              <div className="space-y-3 rounded-lg border bg-background p-4">
                                <div className="flex flex-wrap items-center gap-3">
                                  {booking.goalType ? (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] uppercase tracking-wide"
                                    >
                                      {booking.goalType === "SOLVE_PROBLEM"
                                        ? "Solve a problem"
                                        : "Learn a topic"}
                                    </Badge>
                                  ) : null}
                                  {booking.title ? (
                                    <span className="font-semibold">
                                      {booking.title}
                                    </span>
                                  ) : null}
                                </div>

                                {booking.description ? (
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {booking.description}
                                  </p>
                                ) : null}

                                {booking.attachments &&
                                booking.attachments.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {booking.attachments.map((url) => (
                                      <a
                                        key={url}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-1 text-xs text-brand hover:bg-brand/5"
                                      >
                                        <Paperclip className="h-3 w-3" />
                                        {getAttachmentName(url)}
                                      </a>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination
        paginationInfo={pagination}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
      />
    </div>
  );
}
