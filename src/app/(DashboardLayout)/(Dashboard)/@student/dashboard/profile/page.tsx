import StudentProfileClient from "../../../_component/student/profile/StudentProfileClient";
import { UserService } from "@/service/user.service";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const session = await UserService.getSession();
  const user = session.data?.user;

  return (
    <StudentProfileClient
      initialName={user?.name || "Student name"}
      initialEmail={user?.email || "student@example.com"}
      initialPhone={user?.phone || "01XXXXXXXXX"}
      initialRole={user?.role || "STUDENT"}
      initialStatus={user?.status || "UNBAN"}
      initialImage={user?.image}
    />
  );
}
