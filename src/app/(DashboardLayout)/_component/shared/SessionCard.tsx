"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "@/constants/roles";
import { BookingStatus } from "@/constants/status";
import { convertInto12h } from "@/helpers/TimeHelpers";
import { StudentBookings, TutorBookingSession } from "@/types";
import { format } from "date-fns";
import {
  AlarmClockCheck,
  CircleCheckBig,
  ExternalLink,
  GraduationCap,
  MessageSquare,
  Trash2,
  UserRound,
  Video,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type SessionCardProps = {
  session: TutorBookingSession | StudentBookings;
  animationIndex?: number;
  role: UserRole;

  openReviewSheet?: () => void;
  startClass?: () => void;
  openCompleteSessionSheet?: () => void;
  handleCancelSession?: (session: StudentBookings) => void;
};

export default function SessionCard({
  session,
  animationIndex = 0,
  role,
  openReviewSheet,
  startClass,
  openCompleteSessionSheet,
  handleCancelSession,
}: SessionCardProps) {
  const isStudentRole = role === UserRole.STUDENT;

  const studentSession = isStudentRole ? (session as StudentBookings) : null;
  const tutorSession = !isStudentRole ? (session as TutorBookingSession) : null;

  const personName = isStudentRole
    ? studentSession?.tutor?.user?.name || "Unknown Tutor"
    : tutorSession?.student?.name || "Unknown Student";

  const personSubtitle = isStudentRole
    ? studentSession?.tutor?.category?.name || "No Category"
    : tutorSession?.student?.email || "N/A";

  const hasReview =
    isStudentRole && studentSession ? Boolean(studentSession.reviews) : false;

  return (
    <Card
      className="animate-in fade-in slide-in-from-bottom-2 duration-500 border border-border/80"
      style={{ animationDelay: `${animationIndex * 80}ms` }}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-semibold">
              <UserRound className="size-4 text-brand" />
              {personName}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <GraduationCap className="size-3.5 text-brand" />
              {personSubtitle}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-center">
            <p className="text-sm text-muted-foreground mb-3">
              {format(new Date(session.sessionDate), "MMM dd, yyyy")}
            </p>
            <Badge variant="outline" className="text-sm font-normal">
              {convertInto12h(session.startTime)} -{" "}
              {convertInto12h(session.endTime)}
            </Badge>
          </div>

          <div className="flex flex-col items-start sm:items-center">
            <Badge
              className={
                session.status === BookingStatus.CONFIRMED
                  ? "bg-blue-500 text-white hover:bg-blue-500 font-normal"
                  : session.status === BookingStatus.RUNNING
                    ? "bg-brand text-white hover:bg-brand font-normal"
                    : session.status === BookingStatus.COMPLETED
                      ? "bg-emerald-600 text-white hover:bg-emerald-600 font-normal"
                      : "bg-red-500 text-white hover:bg-red-500 font-normal"
              }
            >
              {session.status}
            </Badge>
            <Badge
              variant="outline"
              className="text-sm mt-3 h-auto font-normal"
            >
              {session.status === BookingStatus.CANCELLED ? (
                <span className="border-muted text-muted-foreground line-through">
                  Fees: {session.price} ৳
                </span>
              ) : (
                `Fees: ${session.price} ৳`
              )}
            </Badge>
          </div>
        </div>

        {isStudentRole ? (
          studentSession?.classLink ? (
            studentSession.status === BookingStatus.RUNNING ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href={studentSession.classLink} target="_blank">
                  <Button className="bg-brand text-white hover:bg-brand-strong font-normal">
                    <Video className="mr-2 size-4" />
                    Join Live Class
                    <ExternalLink className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700 font-normal"
                  disabled
                >
                  <CircleCheckBig className="mr-2 size-4" />
                  Class Completed
                </Button>
                {!hasReview ? (
                  <Button
                    variant="outline"
                    className="border-brand/30 text-brand hover:bg-brand/5 hover:text-brand-strong font-normal"
                    onClick={openReviewSheet}
                  >
                    <MessageSquare className="mr-2 size-4" />
                    Review Session
                  </Button>
                ) : null}
              </div>
            )
          ) : studentSession?.status === BookingStatus.CONFIRMED ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="font-normal" disabled>
                <AlarmClockCheck className="mr-2 size-4" />
                Wait For Class Link
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 font-normal"
                onClick={() => {
                  handleCancelSession &&
                    handleCancelSession(session as StudentBookings);
                }}
              >
                <Trash2 className="mr-2 size-4" />
                Cancel Session
              </Button>
            </div>
          ) : studentSession?.status === BookingStatus.CANCELLED ? (
            <Button
              variant="outline"
              className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:text-red-400 font-normal"
              disabled
            >
              <XCircle className="mr-2 size-4" />
              Class Cancelled
            </Button>
          ) : null
        ) : tutorSession?.status === BookingStatus.RUNNING ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 bg-blue-500 text-white hover:bg-blue-600 font-normal"
              onClick={startClass}
            >
              <Video className="mr-2 size-4" />
              Send Link Again
            </Button>
            <Button
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 font-normal"
              onClick={openCompleteSessionSheet}
            >
              <CircleCheckBig className="mr-2 size-4" />
              Mark as Completed
            </Button>
          </div>
        ) : tutorSession?.status === BookingStatus.COMPLETED ? (
          <Button
            className="bg-emerald-600 text-white hover:bg-emerald-700 font-normal"
            disabled
          >
            <CircleCheckBig className="mr-2 size-4" />
            Class Completed
          </Button>
        ) : tutorSession?.status === BookingStatus.CANCELLED ? (
          <Button
            variant="outline"
            className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:text-red-400 font-normal"
            disabled
          >
            <XCircle className="mr-2 size-4" />
            Class Cancelled
          </Button>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="bg-brand text-white hover:bg-brand-strong font-normal"
              onClick={startClass}
            >
              <Video className="mr-2 size-4" />
              Start Class
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
