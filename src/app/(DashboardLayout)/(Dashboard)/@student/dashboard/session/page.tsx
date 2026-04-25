import StudentSessionClient from "../../../_component/student/session/StudentSessionClient";

export const revalidate = 20;

export default function StudentSessionPage() {
  return <StudentSessionClient initialSessions={[]} />;
}
