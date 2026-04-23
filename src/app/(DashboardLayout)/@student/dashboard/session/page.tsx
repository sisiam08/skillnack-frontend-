import StudentSessionClient from "@/app/(DashboardLayout)/_component/student/session/StudentSessionClient";
import { BOOKING_REVALIDATE } from "@/service/booking.service";

export const revalidate = BOOKING_REVALIDATE;

export default function StudentSessionPage() {
  return <StudentSessionClient initialSessions={[]} />;
}
