export type ReviewType = {
  id?: string;
  bookingId?: string;
  rating: number;
  comment: string;
  tutorName?: string;
  tutorImage?: string;
  tutorCategory?: string;
  studentName?: string;
  studentImage?: string;
};
