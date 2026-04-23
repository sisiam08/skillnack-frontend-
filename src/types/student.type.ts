export type StudentStats = {
  totalBookings: number;
  monthlyBookings: number;
  completedSessions: number;
  completionRate: number;
  totalSpent: number;
  refundableAmount: number;
};

export type StudentRecentActivity = {
  recentSession: {
    tutorName: string;
    categoryName: string;
    timeAgo: string;
  };
  recentReview: {
    rating: number;
    tutorName: string;
    timeAgo: string;
  };
  recentBooking: {
    sessionDate: string;
    categoryName: string;
    timeAgo: string;
  };
};
