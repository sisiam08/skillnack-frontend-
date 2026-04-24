import TutorSessionClient from "@/app/(DashboardLayout)/_component/tutor/session/TutorSessionClient";
import { BOOKING_REVALIDATE, BookingService } from "@/service/booking.service";

export const revalidate = BOOKING_REVALIDATE;

export default async function TutorSessionPage() {
  const bookingSessions = await BookingService.getBookingSessions();

  const initialSessions = bookingSessions.data || [];

  return <TutorSessionClient initialSessions={initialSessions} />;
}
