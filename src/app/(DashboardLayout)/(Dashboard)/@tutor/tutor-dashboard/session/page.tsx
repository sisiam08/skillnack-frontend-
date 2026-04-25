import { BookingService } from "@/service/booking.service";
import TutorSessionClient from "../../../_component/tutor/session/TutorSessionClient";

export const revalidate = 20;

export default async function TutorSessionPage() {
  const bookingSessions = await BookingService.getBookingSessions();

  const initialSessions = bookingSessions.data || [];

  return <TutorSessionClient initialSessions={initialSessions} />;
}
