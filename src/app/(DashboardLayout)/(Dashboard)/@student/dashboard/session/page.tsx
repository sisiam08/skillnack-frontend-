import { BOOKING_REVALIDATE } from "@/service/booking.service";
import StudentSessionClient from "../../../_component/student/session/StudentSessionClient";

export const revalidate = BOOKING_REVALIDATE;

export default function StudentSessionPage() {
  return <StudentSessionClient initialSessions={[]} />;
}
