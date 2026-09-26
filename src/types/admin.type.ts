import { VerificationStatus } from "@/constants/status";
import { SubjectType } from "./taxonomy.type";

export type AdminTutor = {
  id: string;
  userId: string;
  headline?: string | null;
  currentRoleOrInstitution?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  bio?: string | null;
  hourlyRate: number;
  experienceYears: number;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    status: string;
  };
  category?: { id: string; name: string } | null;
  subjects?: SubjectType[];
  skills?: SubjectType[];
};

export type AdminDashboardStats = {
  totalUsers: number;
  totalTutors: number;
  bannedTutors: number;
  totalStudents: number;
  totalBookings: number;
  totalReviews: number;
};

export type AdminAnalyticsRange = "7d" | "30d" | "90d" | "12m";

export type AdminRevenuePoint = {
  label: string;
  gmv: number;
  commission: number;
  payout: number;
};

export type AdminUserGrowthPoint = {
  label: string;
  students: number;
  tutors: number;
};

export type AdminAnalytics = {
  range: {
    key: AdminAnalyticsRange;
    days: number;
    isMonthly: boolean;
    from: string;
    to: string;
  };
  revenue: {
    gmv: number;
    commission: number;
    tutorPayout: number;
    paidBookings: number;
    avgBookingValue: number;
    series: AdminRevenuePoint[];
  };
  bookings: {
    statusCounts: Record<
      "PENDING" | "CONFIRMED" | "RUNNING" | "COMPLETED" | "CANCELLED",
      number
    >;
    totalCreated: number;
    paid: number;
    funnel: { stage: string; count: number; pct: number }[];
    paidConversionRate: number;
    completionRate: number;
    cancellationRate: number;
    avgSessionMinutes: number;
  };
  tutorFunnel: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
  };
  demandByCategory: { category: string; bookings: number; revenue: number }[];
  supplyByCategory: { category: string; tutors: number }[];
  supplyBySubject: { name: string; tutors: number }[];
  supplyBySkill: { name: string; tutors: number }[];
  topTutors: {
    name: string;
    revenue: number;
    paidBookings: number;
    completed: number;
  }[];
  userGrowth: {
    isMonthly: boolean;
    series: AdminUserGrowthPoint[];
  };
  solveRate: {
    solved: number;
    total: number;
    rate: number;
  };
  activeTutors: {
    active: number;
    total: number;
    inactive: number;
    windowDays: number;
  };
  ratingDistribution: { rating: number; count: number }[];
  goalSplit: { goalType: string; count: number }[];
  hourlyRateDistribution: { bucket: string; count: number }[];
  ratingVsCompleted: { name: string; completed: number; rating: number }[];
};

