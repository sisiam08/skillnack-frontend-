import { TutorService } from "@/service/tutor.service";
import { AvailabilityType } from "@/types";
import { TutorAvailabilityClient } from "../../../_component/tutor/availability/TutorAvailabilityClient";

export const dynamic = "force-dynamic";

export default async function TutorAvailabilityPage() {
  const response = await TutorService.getTutorProfile();
  const availabilities: AvailabilityType[] =
    response?.data?.data?.availability ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <TutorAvailabilityClient initialAvailabilities={availabilities} />
    </div>
  );
}
