import { User } from "better-auth";

export type TutorBookingSession = {
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

export type StudentBookings = {
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

export type Bookings = {
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
