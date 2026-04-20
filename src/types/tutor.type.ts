
export type TutorProfile = {
  id: string;
  userId: string;
  categoriesId: string;
  bio?: string | null;
  hourlyRate: number;
  experienceYears: number;
  totalRating: number;
  totalReviews: number;
  totalCompletedBookings: number;
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
};

export type TutorProfileUpdateData = {
  userId: string;
  categoriesId: string;
  bio?: string | null;
  hourlyRate: number;
  experienceYears: number;
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
};
