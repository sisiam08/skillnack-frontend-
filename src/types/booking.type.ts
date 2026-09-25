import { User } from "better-auth";

export type BookingGoalType = "SOLVE_PROBLEM" | "LEARN_TOPIC";

export type SessionOutcome = "SOLVED" | "PARTIALLY_SOLVED" | "NOT_SOLVED";

export type BookingRequestFields = {
  title?: string | null;
  description?: string | null;
  goalType?: BookingGoalType | null;
  attachments?: string[];
  outcome?: SessionOutcome | null;
  outcomeAt?: string | null;
  summary?: string | null;
  summaryAt?: string | null;
  summaryUpdatedAt?: string | null;
};

export type TutorBookingSession = BookingRequestFields & {
  id: string;
  studentId: string;
  tutorId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  student: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export type StudentBookings = BookingRequestFields & {
  id: string;
  studentId: string;
  tutorId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  classLink: string;
  tutor: {
    id: string;
    user: {
      name: string;
      email: string;
      role: string;
    };
    category: {
      name: string;
    };
  };
  reviews?: {
    rating: number;
    comment: string;
  };
};

export type BookingSlot = {
  sessionDate: string;
  startTime: string;
  endTime: string;
};

export type StudentSessionBuckets = {
  todaySessions: StudentBookings[];
  upcomingSessions: StudentBookings[];
  historySessions: StudentBookings[];
  withoutReviewSessions: StudentBookings[];
  completedCount: number;
};

export type Bookings = BookingRequestFields & {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  tutor: {
    user: {
      name: string;
      email: string;
      role: string;
      image?: string;
    };
    category: {
      name: string;
    };
  };
  student: {
    name: string;
    email: string;
    role: string;
    image?: string;
  };
  reviews?: {
    rating: number;
    comment: string;
  };
};
