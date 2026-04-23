"use client";

import { useEffect, useRef, useState } from "react";
import { Bookings, BookingsFilters, PaginationType } from "@/types";
import { UserRole } from "@/constants/roles";
import BookingsHistory from "@/app/(DashboardLayout)/_component/shared/BookingsHistory";
import { getMyBookings } from "@/action/booking.action";

type StudentBookingsHistoryClientProps = {
  initialBookings: Bookings[];
  initialPagination: PaginationType;
  initialFilters: BookingsFilters;
};

export default function StudentBookingsHistoryClient({
  initialBookings,
  initialPagination,
  initialFilters,
}: StudentBookingsHistoryClientProps) {
  const [bookings, setBookings] = useState<Bookings[]>(initialBookings);
  const [pagination, setPagination] =
    useState<PaginationType>(initialPagination);
  const [filters, setFilters] = useState<BookingsFilters>(initialFilters);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    (async () => {
      const response = await getMyBookings(filters);

      if (response.error || !response.data) return;

      setBookings(response.data.data.data);
      setPagination(response.data.data.pagination);
    })();
  }, [filters]);

  return (
    <BookingsHistory
      role={UserRole.STUDENT}
      bookings={bookings}
      pagination={pagination}
      filters={filters}
      setFilters={setFilters}
      expandedReview={expandedReview}
      setExpandedReview={setExpandedReview}
    />
  );
}
