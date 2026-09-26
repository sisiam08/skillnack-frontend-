import type { Metadata } from "next";
import Image from "next/image";
import { TutorService } from "@/service/tutor.service";
import { Card, CardContent } from "@/components/ui/card";
import { ParamsProps, TutorProfile } from "@/types";
import { VerificationStatus } from "@/constants/status";
import { BadgeCheck, ExternalLink } from "lucide-react";

import TutorBookingPanel from "../../_component/page/find-tutors/id/TutorBookingPanel";

import { AvailabilityService } from "@/service/availability.service";
import { ReviewService } from "@/service/review.service";
import Availabilities from "@/components/shared/Availabilities";
import Reviews from "../../_component/page/find-tutors/id/Reviews";

const DEFAULT_AVATAR = "/default-avatar-profile.jpg";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: ParamsProps): Promise<Metadata> {
  const { id } = await params;
  const response = await TutorService.getTutorById(id);
  const tutor = response.data?.data;

  if (!tutor) {
    return {
      title: "Tutor Profile",
      description: "View tutor profiles on Ilmefy.",
      alternates: { canonical: `/find-tutors/${id}` },
    };
  }

  const name = tutor.user?.name ?? "Tutor";
  const category = tutor.category?.name ?? "Tutoring";
  const title = `${name} — ${category} Tutor`;
  const description =
    (tutor.bio && tutor.bio.trim()) ||
    `Book ${name}, an experienced ${category} tutor on Ilmefy. Focused 1-on-1 online sessions, pay per session.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical: `/find-tutors/${id}` },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: `/find-tutors/${id}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
    },
  };
}

export default async function TutorProfileDetailPage({ params }: ParamsProps) {
  const { id: tutorId } = await params;

  const tutorResponse = await TutorService.getTutorById(tutorId);
  const tutorDetails = (
    tutorResponse?.data?.success ? tutorResponse.data.data : null
  ) as TutorProfile | null;

  const [availabilityResponse, reviewsResponse] = await Promise.all([
    AvailabilityService.getAvailability(tutorId),
    ReviewService.getAllReviewsForTutorProfile(tutorId),
  ]);

  const availabilities = availabilityResponse?.data?.success
    ? availabilityResponse.data.data
    : [];
  const reviews = reviewsResponse?.data?.success
    ? reviewsResponse.data.data
    : [];

  const avgRating =
    tutorDetails?.totalReviews && tutorDetails?.totalRating
      ? Number(
          (tutorDetails.totalRating / tutorDetails.totalReviews).toFixed(1),
        )
      : 0;

  const totalOutcomes = tutorDetails?.totalOutcomesRecorded ?? 0;
  const solveRate =
    totalOutcomes > 0
      ? Math.round(((tutorDetails?.solvedCount ?? 0) / totalOutcomes) * 100)
      : null;

  const siteUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

  const tutorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: tutorDetails?.user?.name ?? "Tutor",
    jobTitle: `${tutorDetails?.category?.name ?? "Tutoring"} Tutor`,
    description: tutorDetails?.bio || undefined,
    image: tutorDetails?.user?.image || undefined,
    url: `${siteUrl}/find-tutors/${tutorId}`,
    knowsAbout: [
      ...(tutorDetails?.subjects?.map((subject) => subject.name) ?? []),
      ...(tutorDetails?.skills?.map((skill) => skill.name) ?? []),
    ],
    ...(tutorDetails?.totalReviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: tutorDetails.totalReviews,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(tutorDetails?.hourlyRate
      ? {
          makesOffer: {
            "@type": "Offer",
            price: tutorDetails.hourlyRate,
            priceCurrency: "BDT",
            category: "1-on-1 online tutoring",
          },
        }
      : {}),
  };

  const expertiseTags = Array.from(
    new Set(
      [
        ...(tutorDetails?.subjects?.map((subject) => subject.name) || []),
        ...(tutorDetails?.skills?.map((skill) => skill.name) || []),
        ...(tutorDetails?.tags || []),
        tutorDetails?.category?.name,
      ].filter(Boolean) as string[],
    ),
  ).slice(0, 8);

  return (
    <main className="relative min-h-screen overflow-hidden pb-28 pt-8 lg:pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tutorJsonLd) }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 ">
        <div className="grid space-y-6 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative mx-auto size-24 overflow-hidden rounded-2xl border border-border sm:mx-0 sm:size-28">
                    <Image
                      src={tutorDetails?.user?.image ?? DEFAULT_AVATAR}
                      alt={tutorDetails?.user?.name ?? "Tutor profile"}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      quality={80}
                      className="object-cover"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="flex-1">
                    <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                      {tutorDetails?.user?.name ?? "Tutor"}
                      {tutorDetails?.verificationStatus ===
                      VerificationStatus.APPROVED ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                          <BadgeCheck className="size-3.5" />
                          Verified
                        </span>
                      ) : null}
                    </h1>

                    {tutorDetails?.headline ? (
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {tutorDetails.headline}
                      </p>
                    ) : null}

                    {tutorDetails?.currentRoleOrInstitution ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tutorDetails.currentRoleOrInstitution}
                      </p>
                    ) : null}

                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                      {tutorDetails?.category?.name ?? "Subject"} Tutor •{" "}
                      {tutorDetails?.experienceYears ?? 0}+ Years Experience
                    </p>

                    {[
                      { label: "LinkedIn", url: tutorDetails?.linkedinUrl },
                      { label: "GitHub", url: tutorDetails?.githubUrl },
                      { label: "Portfolio", url: tutorDetails?.portfolioUrl },
                    ].some((link) => Boolean(link.url)) ? (
                      <div className="mt-2 flex flex-wrap gap-3">
                        {[
                          { label: "LinkedIn", url: tutorDetails?.linkedinUrl },
                          { label: "GitHub", url: tutorDetails?.githubUrl },
                          { label: "Portfolio", url: tutorDetails?.portfolioUrl },
                        ]
                          .filter((link) => Boolean(link.url))
                          .map((link) => (
                            <a
                              key={link.label}
                              href={link.url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                            >
                              <ExternalLink className="size-3" />
                              {link.label}
                            </a>
                          ))}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {expertiseTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground"
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

                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {avgRating}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Solve rate</p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {solveRate !== null ? `${solveRate}%` : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {solveRate !== null
                        ? `${totalOutcomes} reported`
                        : "Not enough data"}
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

            <Availabilities
              availabilities={availabilities}
              isTutorView={false}
              className="rounded-2xl border border-border/70 bg-card/80 text-foreground"
            />
          </section>

          <TutorBookingPanel
            tutorId={tutorId}
            hourlyRate={tutorDetails?.hourlyRate ?? 0}
          />
        </div>
        <Reviews reviews={reviews} avgRating={avgRating} />
      </div>
    </main>
  );
}
