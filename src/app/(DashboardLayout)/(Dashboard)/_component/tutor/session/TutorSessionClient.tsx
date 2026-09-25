"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BookingStatus } from "@/constants/status";
import { UserRole } from "@/constants/roles";
import { TutorBookingSession } from "@/types";
import { toast } from "@/components/ui/sonner";

import { CalendarClock, Clock3, Link2 } from "lucide-react";
import {
  format,
  isToday,
  isAfter,
  isBefore,
  startOfToday,
  startOfDay,
} from "date-fns";
import {
  getBookingSessions,
  updateBookingStatus,
} from "@/action/booking.action";
import SendClassLinkSheet from "./SendClassLinkSheet";
import CompleteSessionSheet from "./CompleteSessionSheet";
import TutorSummarySheet from "./TutorSummarySheet";
import {
  getDefaultClassLink,
  sendClassLink,
} from "@/action/tutor.action";
import { v7 as uuidv7 } from "uuid";
import { useRouter } from "next/navigation";
import SessionCard from "../../shared/SessionCard";

interface TutorSessionClientProps {
  initialSessions: TutorBookingSession[];
}

export default function TutorSessionClient({
  initialSessions,
}: TutorSessionClientProps) {
  const [todaySessions, setTodaySessions] = useState<TutorBookingSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<
    TutorBookingSession[]
  >([]);
  const [activeSession, setActiveSession] =
    useState<TutorBookingSession | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSession, setSheetSession] = useState<TutorBookingSession | null>(
    null,
  );
  const [classLink, setClassLink] = useState("");

  const [completeSessionSheetOpen, setCompleteSessionSheetOpen] =
    useState(false);
  const [completedSession, setCompletedSession] =
    useState<TutorBookingSession | null>(null);

  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [summarySession, setSummarySession] =
    useState<TutorBookingSession | null>(null);

  let randomId = uuidv7();

  const hasSessionEnded = (session: TutorBookingSession): boolean => {
    const today = startOfToday();
    const sessionDay = startOfDay(new Date(session.sessionDate));
    if (isBefore(sessionDay, today)) return true;
    if (isAfter(sessionDay, today)) return false;
    const currentTime = format(new Date(), "HH:mm");
    return session.endTime <= currentTime;
  };

  const loadSessions = async () => {
    const response = await getBookingSessions();

    if (response.error || !response.data) return;

    const allSessions: TutorBookingSession[] = response.data.data.data;

    const today = startOfToday();

    const todayList = allSessions.filter((s) =>
      isToday(new Date(s.sessionDate)),
    );

    console.log("Today Sessions:", todayList);

    const upcomingList = allSessions.filter((s) =>
      isAfter(startOfDay(new Date(s.sessionDate)), today),
    );

    setTodaySessions(todayList);
    setUpcomingSessions(upcomingList);

    const runningSession = todayList.find(
      (s) => s.status === BookingStatus.RUNNING,
    );
    if (runningSession) {
      setActiveSession(runningSession);
      if (hasSessionEnded(runningSession)) {
        openCompleteSessionSheet(runningSession);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (initialSessions.length > 0) {
        const today = startOfToday();
        const todayList = initialSessions.filter((s) =>
          isToday(new Date(s.sessionDate)),
        );
        const upcomingList = initialSessions.filter((s) =>
          isAfter(startOfDay(new Date(s.sessionDate)), today),
        );
        setTodaySessions(todayList);
        setUpcomingSessions(upcomingList);
      }
      await loadSessions();

      const classLinkResponse = await getDefaultClassLink();

      if (classLinkResponse.error || !classLinkResponse.data) return;
    })();
  }, [initialSessions]);

  const confirmCompletedSession = async () => {
    if (!completedSession) return;

    const finishedSession = completedSession;
    const toastId = toast.loading("Marking session as completed...");
    try {
      const response = await updateBookingStatus(
        completedSession.id,
        BookingStatus.COMPLETED,
      );
      if (response.error || !response.data) {
        toast.error("Failed to mark session as completed", { id: toastId });
        return;
      }
      toast.success("Session marked as completed!", { id: toastId });

      await loadSessions();

      setActiveSession(null);

      // Non-blocking: prompt the tutor to leave a short summary.
      setSummarySession(finishedSession);
      setSummarySheetOpen(true);
    } catch {
      toast.error("Failed to mark session as completed", { id: toastId });
    }

    setCompleteSessionSheetOpen(false);
    setCompletedSession(null);
  };

  const openSummarySheet = (session: TutorBookingSession) => {
    setSummarySession(session);
    setSummarySheetOpen(true);
  };

  const openCompleteSessionSheet = (session: TutorBookingSession) => {
    setCompletedSession(session);
    setCompleteSessionSheetOpen(true);
  };

  const dismissCompleteSessionSheet = () => {
    setCompleteSessionSheetOpen(false);
    setCompletedSession(null);
  };

  const openInNewTab = (randomId: string, bookingId?: string) => {
    const url = bookingId
      ? `/class/${randomId}?bookingId=${bookingId}`
      : `/class/${randomId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const startClass = (session: TutorBookingSession) => {
    if (activeSession) {
      if (hasSessionEnded(activeSession)) {
        openCompleteSessionSheet(activeSession);
        return;
      }
      if (activeSession.id === session.id) {
        setClassLink("");
        setSheetOpen(true);
        setSheetSession(session);
        openInNewTab(randomId, session.id);
        return;
      }
      toast.error(
        "You have an active session. Please complete it before starting another.",
      );
      return;
    }

    setClassLink("");
    setSheetOpen(true);
    setSheetSession(session);
    openInNewTab(randomId, session.id);
  };

  const sendLink = async (classLink: string) => {
    if (!sheetSession) return;

    const toastId = toast.loading("Sending class link...");
    try {
      const response = await sendClassLink(sheetSession.id, classLink.trim());

      if (response.error || !response.data) {
        toast.error(response.error?.message || "Failed to send class link", {
          id: toastId,
        });
        return;
      }
      toast.success("Class link sent successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to send class link", { id: toastId });
    }

    await loadSessions();

    setActiveSession(sheetSession);
    setSheetSession(null);
    setSheetOpen(false);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
        <Card className="overflow-hidden border-border/70 bg-linear-to-r from-orange-50 via-white to-amber-50 dark:from-card dark:via-card dark:to-card">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="ui-title-panel">Tutor Sessions</CardTitle>
              <CardDescription>Enjoy your sessions.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 font-normal">
                {todaySessions.length} Today
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {upcomingSessions.length} Upcoming
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div>
          <div className="space-y-6 xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock3
                    className="size-4 text-brand"
                    suppressHydrationWarning
                  />
                  Today's Sessions
                </CardTitle>
                <CardDescription>Sessions scheduled for today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaySessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No session scheduled for today.
                  </p>
                ) : (
                  todaySessions.map((session, idx) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      role={UserRole.TUTOR}
                      animationIndex={idx}
                      startClass={() => startClass(session)}
                      openCompleteSessionSheet={() =>
                        openCompleteSessionSheet(session)
                      }
                      openSummarySheet={() => openSummarySheet(session)}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock
                    className="size-4 text-brand"
                    suppressHydrationWarning
                  />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>Future confirmed sessions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No upcoming sessions available.
                  </p>
                ) : (
                  upcomingSessions.map((session, idx) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      role={UserRole.TUTOR}
                      animationIndex={idx}
                      startClass={() => startClass(session)}
                      openCompleteSessionSheet={() =>
                        openCompleteSessionSheet(session)
                      }
                      openSummarySheet={() => openSummarySheet(session)}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SendClassLinkSheet
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
        classLink={classLink}
        setClassLink={setClassLink}
        sendLink={sendLink}
      />

      <CompleteSessionSheet
        completeSessionSheetOpen={completeSessionSheetOpen}
        setCompleteSessionSheetOpen={setCompleteSessionSheetOpen}
        completedSession={completedSession}
        dismissCompleteSessionSheet={dismissCompleteSessionSheet}
        confirmCompletedSession={confirmCompletedSession}
      />

      <TutorSummarySheet
        open={summarySheetOpen}
        setOpen={setSummarySheetOpen}
        session={summarySession}
        onSaved={loadSessions}
      />
    </>
  );
}
