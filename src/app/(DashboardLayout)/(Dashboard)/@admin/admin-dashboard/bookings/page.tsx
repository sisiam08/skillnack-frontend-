import AdminBookingsClient from "../../../_component/admin/bookings/AdminBookingsClient";
import { BookingService } from "@/service/booking.service";
import { Bookings, BookingsFilters, PaginationType } from "@/types";

export const dynamic = "force-dynamic";

const initialFilters: BookingsFilters = {
  status: undefined,
  page: "1",
  limit: "10",
};

export default async function AdminBookingsPage() {
  const response = await BookingService.getAllBookings(initialFilters);

  const initialBookings: Bookings[] = response.data?.data?.data ?? [];
  const initialPagination: PaginationType = response.data?.data?.pagination ?? {
    totalData: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <AdminBookingsClient
      initialBookings={initialBookings}
      initialPagination={initialPagination}
      initialFilters={initialFilters}
    />
  );
}
