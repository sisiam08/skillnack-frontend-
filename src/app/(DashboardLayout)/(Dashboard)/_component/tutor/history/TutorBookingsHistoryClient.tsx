"use client";

import { useEffect, useRef, useState } from "react";
import { Bookings, BookingsFilters, PaginationType } from "@/types";
import { UserRole } from "@/constants/roles";
import { getBookingSessions } from "@/action/booking.action";
import BookingsHistory from "../../shared/BookingsHistory";

type TutorBookingsHistoryClientProps = {
  initialBookings: Bookings[];
  initialPagination: PaginationType;
  initialFilters: BookingsFilters;
};

export default function TutorBookingsHistoryClient({
  initialBookings,
  initialPagination,
  initialFilters,
}: TutorBookingsHistoryClientProps) {
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
      const response = await getBookingSessions(filters);

      if (response.error || !response.data) return;

      setBookings(response.data.data.data);
      setPagination(response.data.data.pagination);
    })();
  }, [filters]);

  return (
    <BookingsHistory
      role={UserRole.TUTOR}
      bookings={bookings}
      pagination={pagination}
      filters={filters}
      setFilters={setFilters}
      expandedReview={expandedReview}
      setExpandedReview={setExpandedReview}
    />
  );
}
