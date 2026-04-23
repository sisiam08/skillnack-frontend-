"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PaginationType, UserType, UsersFilter } from "@/types";
import { UserRole } from "@/constants/roles";
import { UserStatus } from "@/constants/status";
import { format } from "date-fns";
import Pagination from "@/components/shared/Pagination";
import { getAllUsers, updateUserStatus } from "@/action/admin.action";

type UsersClientProps = {
  initialUsers: UserType[];
  initialPagination: PaginationType;
  initialFilters: UsersFilter;
};

export default function UsersClient({
  initialUsers,
  initialPagination,
  initialFilters,
}: UsersClientProps) {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [pagination, setPagination] =
    useState<PaginationType>(initialPagination);
  const isFirstRender = useRef(true);

  const [filters, setFilters] = useState<UsersFilter>(initialFilters);

  const loadUsers = async () => {
    const response = await getAllUsers(filters);
    if (response.error || !response.data) return;

    setUsers(response.data.data.data);
    setPagination(response.data.data.pagination);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    loadUsers();
  }, [filters]);

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === pagination.page
    ) {
      return;
    }

    setFilters({
      ...filters,
      page: String(nextPage),
    });
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters({
      ...filters,
      limit: String(newLimit),
      page: "1",
    });
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    const toastId = toast.loading("Updating user status...");
    try {
      const response = await updateUserStatus(userId, newStatus);

      if (response.error || !response.data) {
        toast.error(
          response.error?.message || "Failed to update user status!",
          {
            id: toastId,
          },
        );
        return;
      }

      toast.success("User status updated successfully.", { id: toastId });
      await loadUsers();
    } catch {
      toast.error("Failed to update user status!", { id: toastId });
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case UserRole.TUTOR:
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case UserRole.STUDENT:
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="ui-title-panel">User Management</CardTitle>
            <CardDescription>
              View and manage all users on the platform.
            </CardDescription>
          </div>
          <Badge className="bg-brand text-white hover:bg-brand">
            {pagination.totalData}{" "}
            {filters.role === UserRole.STUDENT
              ? "Students"
              : filters.role === UserRole.TUTOR
                ? "Tutors"
                : filters.role === UserRole.ADMIN
                  ? "Admins"
                  : "Users"}
          </Badge>
        </CardHeader>
      </Card>

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:80ms]">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter users by role, status, or search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, page: "1" })
                }
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.role === undefined ? "default" : "outline"}
                onClick={() =>
                  setFilters({ ...filters, role: undefined, page: "1" })
                }
                className={
                  filters.role === undefined
                    ? "bg-brand hover:bg-brand-strong dark:text-white"
                    : ""
                }
              >
                All
              </Button>
              <Button
                variant={
                  filters.role === UserRole.STUDENT ? "default" : "outline"
                }
                onClick={() =>
                  setFilters({ ...filters, role: UserRole.STUDENT, page: "1" })
                }
                className={
                  filters.role === UserRole.STUDENT
                    ? "bg-brand hover:bg-brand-strong dark:text-white"
                    : ""
                }
              >
                Students
              </Button>
              <Button
                variant={
                  filters.role === UserRole.TUTOR ? "default" : "outline"
                }
                onClick={() =>
                  setFilters({ ...filters, role: UserRole.TUTOR, page: "1" })
                }
                className={
                  filters.role === UserRole.TUTOR
                    ? "bg-brand hover:bg-brand-strong dark:text-white"
                    : ""
                }
              >
                Tutors
              </Button>
              <Button
                variant={
                  filters.role === UserRole.ADMIN ? "default" : "outline"
                }
                onClick={() =>
                  setFilters({ ...filters, role: UserRole.ADMIN, page: "1" })
                }
                className={
                  filters.role === UserRole.ADMIN
                    ? "bg-brand hover:bg-brand-strong dark:text-white"
                    : ""
                }
              >
                Admins
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.status === undefined ? "default" : "outline"}
              onClick={() =>
                setFilters({ ...filters, status: undefined, page: "1" })
              }
              className={
                filters.status === undefined
                  ? "bg-brand hover:bg-brand-strong dark:text-white"
                  : ""
              }
            >
              All Status
            </Button>
            <Button
              variant={
                filters.status === UserStatus.UNBAN ? "default" : "outline"
              }
              onClick={() =>
                setFilters({ ...filters, status: UserStatus.UNBAN, page: "1" })
              }
              className={
                filters.status === UserStatus.UNBAN
                  ? "bg-brand hover:bg-brand-strong dark:text-white"
                  : ""
              }
            >
              Active
            </Button>
            <Button
              variant={
                filters.status === UserStatus.BAN ? "default" : "outline"
              }
              onClick={() =>
                setFilters({ ...filters, status: UserStatus.BAN, page: "1" })
              }
              className={
                filters.status === UserStatus.BAN
                  ? "bg-brand hover:bg-brand-strong dark:text-white"
                  : ""
              }
            >
              Banned
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:140ms]">
        <CardHeader>
          <CardTitle>
            {filters.role === UserRole.STUDENT
              ? "Students"
              : filters.role === UserRole.TUTOR
                ? "Tutors"
                : filters.role === UserRole.ADMIN
                  ? "Admins"
                  : "All Users"}
          </CardTitle>
          <CardDescription>
            Manage user accounts and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="rounded-md border bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
              No users found matching your filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-180 lg:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4 sm:pl-6">User</TableHead>
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="hidden md:table-cell text-center">
                      Joined
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback className="bg-brand/10 text-brand text-sm">
                              {user.name?.charAt(0) ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.name ?? "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center text-muted-foreground">
                        {format(new Date(user.createdAt), "PP")}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.status === UserStatus.UNBAN ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            <ShieldBan className="mr-1 h-3 w-3" />
                            Banned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.role !== UserRole.ADMIN && (
                          <>
                            {user.status === UserStatus.UNBAN ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(user.id, UserStatus.BAN)
                                }
                              >
                                <ShieldBan className="mr-1 h-4 w-4" />
                                Ban
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-600 text-green-600 hover:bg-green-50 dark:text-green-400"
                                onClick={() =>
                                  handleStatusChange(user.id, UserStatus.UNBAN)
                                }
                              >
                                <ShieldCheck className="mr-1 h-4 w-4" />
                                Unban
                              </Button>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination
        paginationInfo={pagination}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
      />
    </div>
  );
}
