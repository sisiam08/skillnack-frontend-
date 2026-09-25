import VerificationClient from "../../../_component/admin/verification/VerificationClient";
import { AdminService } from "@/service/admin.service";
import { AdminTutor, PaginationType, TutorsFilter } from "@/types";

export const dynamic = "force-dynamic";

const initialFilters: TutorsFilter = {
  verificationStatus: "PENDING",
  search: undefined,
  page: "1",
  limit: "10",
};

export default async function VerificationPage() {
  const response = await AdminService.getTutors(initialFilters);

  const initialTutors: AdminTutor[] = response.data?.data?.data ?? [];
  const initialPagination: PaginationType = response.data?.data?.pagination ?? {
    totalData: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <VerificationClient
      initialTutors={initialTutors}
      initialPagination={initialPagination}
      initialFilters={initialFilters}
    />
  );
}
