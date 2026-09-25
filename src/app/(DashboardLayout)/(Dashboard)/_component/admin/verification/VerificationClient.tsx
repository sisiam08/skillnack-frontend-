"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Pagination from "@/components/shared/Pagination";
import { toast } from "@/components/ui/sonner";
import { VerificationStatus } from "@/constants/status";
import { getTutors, updateTutorVerification } from "@/action/admin.action";
import {
  AdminTutor,
  PaginationType,
  TutorsFilter,
} from "@/types";
import {
  BadgeCheck,
  BadgeX,
  Clock,
  ExternalLink,
  Search,
} from "lucide-react";

type VerificationClientProps = {
  initialTutors: AdminTutor[];
  initialPagination: PaginationType;
  initialFilters: TutorsFilter;
};

const STATUS_TABS: { label: string; value?: VerificationStatus }[] = [
  { label: "Pending", value: VerificationStatus.PENDING },
  { label: "Approved", value: VerificationStatus.APPROVED },
  { label: "Rejected", value: VerificationStatus.REJECTED },
  { label: "All", value: undefined },
];

const statusBadge = (status: VerificationStatus) => {
  if (status === VerificationStatus.APPROVED) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        <BadgeCheck className="mr-1 h-3 w-3" />
        Approved
      </Badge>
    );
  }
  if (status === VerificationStatus.REJECTED) {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        <BadgeX className="mr-1 h-3 w-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
      <Clock className="mr-1 h-3 w-3" />
      Pending
    </Badge>
  );
};

export default function VerificationClient({
  initialTutors,
  initialPagination,
  initialFilters,
}: VerificationClientProps) {
  const [tutors, setTutors] = useState<AdminTutor[]>(initialTutors);
  const [pagination, setPagination] =
    useState<PaginationType>(initialPagination);
  const [filters, setFilters] = useState<TutorsFilter>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search ?? "");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  const loadTutors = async (nextFilters: TutorsFilter) => {
    const response = await getTutors(nextFilters);
    if (response.error || !response.data) return;

    setTutors(response.data.data.data);
    setPagination(response.data.data.pagination);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    loadTutors(filters);
  }, [filters]);

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === pagination.page
    ) {
      return;
    }
    setFilters({ ...filters, page: String(nextPage) });
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters({ ...filters, limit: String(newLimit), page: "1" });
  };

  const handleApprove = async (tutor: AdminTutor) => {
    const toastId = toast.loading("Approving tutor...");
    setBusyId(tutor.id);
    try {
      const response = await updateTutorVerification(
        tutor.id,
        VerificationStatus.APPROVED,
      );

      if (response.error || !response.data) {
        toast.error(response.error?.message || "Failed to approve tutor", {
          id: toastId,
        });
        return;
      }

      toast.success("Tutor approved.", { id: toastId });
      await loadTutors(filters);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (tutor: AdminTutor) => {
    const toastId = toast.loading("Rejecting tutor...");
    setBusyId(tutor.id);
    try {
      const response = await updateTutorVerification(
        tutor.id,
        VerificationStatus.REJECTED,
        rejectionReason.trim() || undefined,
      );

      if (response.error || !response.data) {
        toast.error(response.error?.message || "Failed to reject tutor", {
          id: toastId,
        });
        return;
      }

      toast.success("Tutor rejected.", { id: toastId });
      setRejectingId(null);
      setRejectionReason("");
      await loadTutors(filters);
    } finally {
      setBusyId(null);
    }
  };

  const activeStatus = filters.verificationStatus;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="ui-title-panel">
              Tutor Verification Queue
            </CardTitle>
            <CardDescription>
              Review tutor profiles and approve or reject them for public
              listing.
            </CardDescription>
          </div>
          <Badge className="bg-brand text-white hover:bg-brand">
            {pagination.totalData} {activeStatus ?? "Total"}
          </Badge>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter by verification status or search.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <Button
                key={tab.label}
                variant={
                  activeStatus === tab.value ? "default" : "outline"
                }
                onClick={() =>
                  setFilters({
                    ...filters,
                    verificationStatus: tab.value,
                    page: "1",
                  })
                }
                className={
                  activeStatus === tab.value
                    ? "bg-brand hover:bg-brand-strong dark:text-white"
                    : ""
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setFilters({
                ...filters,
                search: searchInput.trim() || undefined,
                page: "1",
              });
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or headline..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              type="submit"
              className="bg-brand text-white hover:bg-brand-strong"
            >
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tutors.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No tutor profiles found for this filter.
            </CardContent>
          </Card>
        ) : (
          tutors.map((tutor) => (
            <Card key={tutor.id} className="border-border/70">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={tutor.user?.image ?? undefined}
                        alt={tutor.user?.name}
                      />
                      <AvatarFallback>
                        {tutor.user?.name?.charAt(0) ?? "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-semibold">{tutor.user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tutor.user?.email}
                      </p>
                      {tutor.headline ? (
                        <p className="text-sm font-medium">{tutor.headline}</p>
                      ) : null}
                      {tutor.currentRoleOrInstitution ? (
                        <p className="text-sm text-muted-foreground">
                          {tutor.currentRoleOrInstitution}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    {statusBadge(tutor.verificationStatus)}
                    {tutor.category?.name ? (
                      <Badge variant="outline">{tutor.category.name}</Badge>
                    ) : null}
                  </div>
                </div>

                {tutor.bio ? (
                  <p className="text-sm text-muted-foreground">{tutor.bio}</p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {(tutor.subjects ?? []).map((subject) => (
                    <Badge key={subject.id} variant="secondary">
                      {subject.name}
                    </Badge>
                  ))}
                  {(tutor.skills ?? []).map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  {[
                    { label: "LinkedIn", url: tutor.linkedinUrl },
                    { label: "GitHub", url: tutor.githubUrl },
                    { label: "Portfolio", url: tutor.portfolioUrl },
                  ]
                    .filter((link) => Boolean(link.url))
                    .map((link) => (
                      <a
                        key={link.label}
                        href={link.url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {link.label}
                      </a>
                    ))}
                  <span className="text-muted-foreground">
                    ৳{tutor.hourlyRate}/hr • {tutor.experienceYears} yrs
                  </span>
                </div>

                {tutor.verificationStatus === VerificationStatus.REJECTED &&
                tutor.rejectionReason ? (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    Rejection reason: {tutor.rejectionReason}
                  </p>
                ) : null}

                {rejectingId === tutor.id ? (
                  <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                    <Textarea
                      rows={2}
                      placeholder="Optional reason for rejection..."
                      value={rejectionReason}
                      onChange={(event) =>
                        setRejectionReason(event.target.value)
                      }
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRejectingId(null);
                          setRejectionReason("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={busyId === tutor.id}
                        onClick={() => handleReject(tutor)}
                      >
                        Confirm Reject
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tutor.verificationStatus !==
                    VerificationStatus.APPROVED ? (
                      <Button
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        disabled={busyId === tutor.id}
                        onClick={() => handleApprove(tutor)}
                      >
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    ) : null}
                    {tutor.verificationStatus !== VerificationStatus.REJECTED ? (
                      <Button
                        variant="destructive"
                        disabled={busyId === tutor.id}
                        onClick={() => {
                          setRejectingId(tutor.id);
                          setRejectionReason("");
                        }}
                      >
                        <BadgeX className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Pagination
        paginationInfo={pagination}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
      />
    </div>
  );
}
