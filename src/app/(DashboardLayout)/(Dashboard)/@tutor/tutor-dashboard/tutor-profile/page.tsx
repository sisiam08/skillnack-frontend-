import { UserService } from "@/service/user.service";
import { TutorService } from "@/service/tutor.service";
import { CategoryService } from "@/service/category.service";
import { SubjectService } from "@/service/subject.service";
import { SkillService } from "@/service/skill.service";
import { TutorProfile } from "@/types";
import TutorProfileClient from "../../../_component/tutor/profile/TutorProfileClient";

export const dynamic = "force-dynamic";

export default async function TutorProfilePage() {
  const [
    sessionResponse,
    tutorProfileResponse,
    categoriesResponse,
    subjectsResponse,
    skillsResponse,
  ] = await Promise.all([
    UserService.getSession(),
    TutorService.getTutorProfile(),
    CategoryService.getCategories(),
    SubjectService.getSubjects(),
    SkillService.getSkills(),
  ]);

  const user = sessionResponse.data?.user;
  const tutorProfile: TutorProfile | undefined =
    tutorProfileResponse.data?.data ?? undefined;
  const categories = categoriesResponse.data?.data ?? [];
  const subjects = subjectsResponse.data?.data ?? [];
  const skills = skillsResponse.data?.data ?? [];

  return (
    <TutorProfileClient
      initialName={user?.name || "Tutor name"}
      initialEmail={user?.email || "tutor@example.com"}
      initialPhone={user?.phone || "01XXXXXXXXX"}
      initialRole={user?.role || "TUTOR"}
      initialStatus={user?.status || "UNBAN"}
      initialImage={user?.image}
      initialTutorProfile={tutorProfile}
      initialCategories={categories}
      initialSubjects={subjects}
      initialSkills={skills}
      userId={user?.id || ""}
    />
  );
}
