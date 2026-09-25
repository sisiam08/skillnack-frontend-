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
  totalBookingsCompleted: number;
  totalBookingsCancelled: number;
  totalReviews: number;
  totalRevenue: number;
  monthlyRevenue: number;
};

