import UsersClient from "../../../_component/admin/users/UsersClient";
import { AdminService } from "@/service/admin.service";
import { PaginationType, UserType, UsersFilter } from "@/types";

export const dynamic = "force-dynamic";

const initialFilters: UsersFilter = {
  search: undefined,
  role: undefined,
  status: undefined,
  page: "1",
  limit: "10",
};

export default async function UsersPage() {
  const usersResponse = await AdminService.getAllUsers(initialFilters);

  const initialUsers: UserType[] = usersResponse.data?.data?.data ?? [];
  const initialPagination: PaginationType = usersResponse.data?.data
    ?.pagination ?? {
    totalData: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <UsersClient
      initialUsers={initialUsers}
      initialPagination={initialPagination}
      initialFilters={initialFilters}
    />
  );
}
