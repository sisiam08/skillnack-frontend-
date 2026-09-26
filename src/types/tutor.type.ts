import { VerificationStatus } from "@/constants/status";
import { SubjectType } from "./taxonomy.type";

export type TutorProfile = {
  id: string;
  userId: string;
  categoriesId: string;
  bio?: string | null;
  hourlyRate: number;
  experienceYears: number;
  tags: string[];
  headline?: string | null;
  currentRoleOrInstitution?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string | null;
  totalRating: number;
  totalReviews: number;
  totalCompletedBookings: number;
  solvedCount?: number;
  totalOutcomesRecorded?: number;
  availableToday?: boolean;
  availableNow?: boolean;
  user?: {
    id: string;
    name?: string;
    email?: string;
    image?: string | null;
    phone?: string | null;
    role?: string;
    status?: string;
  };
  category?: {
    id?: string;
    name?: string;
  };
  availability?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  subjects?: SubjectType[];
  skills?: SubjectType[];
};

export type TutorCardProps = {
  tutor: TutorProfile;
  animationIndex?: number;
};

export type TutorProfileCreateData = {
  userId: string;
  categoriesId: string;
  bio?: string | null;
  hourlyRate: number;
  experienceYears: number;
  /** Legacy free-text tags — no longer written from the UI. */
  tags?: string[];
  subjectIds?: string[];
  skillIds?: string[];
  headline?: string | null;
  currentRoleOrInstitution?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
};

export type TutorProfileUpdateData = {
  categoriesId?: string;
  bio?: string | null;
  hourlyRate?: number;
  experienceYears?: number;
  tags?: string[];
  subjectIds?: string[];
  skillIds?: string[];
  headline?: string | null;
  currentRoleOrInstitution?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
};

export type TutorStats = {
  earnings: {
    totalEarnings: number;
    earningsThisMonth: number;
    earningsToday: number;
    hourlyRate: number;
  };
  profile: {
    uniqueStudents: number;
    experienceYears: number;
    activeDays: number;
    averageRating: number;
    totalRatings: number;
    reviewCount: number;
  };
  sessions: {
    completed: number;
    completedToday: number;
    completedThisWeek: number;
    cancelled: number;
    cancelledThisMonth: number;
    upcoming: number;
  };
  outcomes: {
    solved: number;
    partiallySolved: number;
    notSolved: number;
  };
  ratingTrend: {
    month: string;
    averageRating: number;
    reviewCount: number;
  }[];
};
