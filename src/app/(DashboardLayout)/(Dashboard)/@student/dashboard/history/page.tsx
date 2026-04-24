import StudentBookingsHistoryClient from "../../../_component/student/history/StudentBookingsHistoryClient";
import { BookingService } from "@/service/booking.service";
import { Bookings, BookingsFilters, PaginationType } from "@/types";

export const dynamic = "force-dynamic";

const initialFilters: BookingsFilters = {
  status: undefined,
  page: "1",
  limit: "10",
};

export default async function StudentBookingsHistoryPage() {
  const response = await BookingService.getMyBookings(initialFilters);

  const initialBookings: Bookings[] = response.data?.data?.data ?? [];
  const initialPagination: PaginationType = response.data?.data?.pagination ?? {
    totalData: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <StudentBookingsHistoryClient
      initialBookings={initialBookings}
      initialPagination={initialPagination}
      initialFilters={initialFilters}
    />
  );
}
