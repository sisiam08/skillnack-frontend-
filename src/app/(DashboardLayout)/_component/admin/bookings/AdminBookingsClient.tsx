"use client";

import { useEffect, useRef, useState } from "react";
import { Bookings, BookingsFilters, PaginationType } from "@/types";
import { UserRole } from "@/constants/roles";
import BookingsHistory from "@/app/(DashboardLayout)/_component/shared/BookingsHistory";
import { getAllBookings } from "@/action/booking.action";

type AdminBookingsClientProps = {
  initialBookings: Bookings[];
  initialPagination: PaginationType;
  initialFilters: BookingsFilters;
};

export default function AdminBookingsClient({
  initialBookings,
  initialPagination,
  initialFilters,
}: AdminBookingsClientProps) {
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
      const response = await getAllBookings(filters);

      if (response.error || !response.data) return;

      setBookings(response.data.data.data);
      setPagination(response.data.data.pagination);
    })();
  }, [filters]);

  return (
    <BookingsHistory
      role={UserRole.ADMIN}
      bookings={bookings}
      pagination={pagination}
      filters={filters}
      setFilters={setFilters}
      expandedReview={expandedReview}
      setExpandedReview={setExpandedReview}
    />
  );
}
