import Image from "next/image";
import { TutorService } from "@/service/tutor.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TutorProfile } from "@/types";

import TutorBookingPanel from "../../_component/page/find-tutors/id/TutorBookingPanel";
import TutorEngagementSection from "../../_component/page/find-tutors/id/TutorEngagementSection";

import defaultImage from "../../../../../public/default-avatar-profile.jpg";

export const revalidate = 300;

type TutorDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TutorProfileDetailPage({
  params,
}: TutorDetailsPageProps) {
  const { id: tutorId } = await params;

  const tutorResponse = await TutorService.getTutorById(tutorId);
  const tutorDetails = (
    tutorResponse?.data?.success ? tutorResponse.data.data : null
  ) as TutorProfile | null;

  const avgRating =
    tutorDetails?.totalReviews && tutorDetails?.totalRating
      ? Number(
          (tutorDetails.totalRating / tutorDetails.totalReviews).toFixed(1),
        )
      : 0;

  const expertiseTags = Array.from(
    new Set(
      [
        tutorDetails?.category?.name,
        "Problem Solving",
        "1:1 Sessions",
        "Exam Strategy",
      ].filter(Boolean) as string[],
    ),
  ).slice(0, 4);
  
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(236,91,19,0.12)_0%,transparent_30%),linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--background)_86%,#f9fafb)_65%,var(--background))] pb-28 pt-8 lg:pb-14">
      <div className="relative mx-auto w-full max-w-7xl px-4 ">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative mx-auto size-24 overflow-hidden rounded-2xl border border-border sm:mx-0 sm:size-28">
                    <Image
                      src={tutorDetails?.user?.image ?? defaultImage}
                      alt={tutorDetails?.user?.name ?? "Tutor profile"}
                      fill
                      unoptimized
                      className="object-cover"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                      {tutorDetails?.user?.name ?? "Tutor"}
                    </h1>
                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                      {tutorDetails?.category?.name ?? "Subject"} Tutor •{" "}
                      {tutorDetails?.experienceYears ?? 0}+ Years Experience
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {expertiseTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {tutorDetails?.bio ||
                        "Professional tutor focused on practical understanding and fast progress."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {avgRating}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Sessions</p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {tutorDetails?.totalCompletedBookings ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Reviews</p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {tutorDetails?.totalReviews ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {tutorDetails?.experienceYears ?? 0} yrs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <TutorEngagementSection tutorId={tutorId} avgRating={avgRating} />
          </section>

          <TutorBookingPanel
            tutorId={tutorId}
            hourlyRate={tutorDetails?.hourlyRate ?? 0}
          />
        </div>
      </div>
    </main>
  );
}
