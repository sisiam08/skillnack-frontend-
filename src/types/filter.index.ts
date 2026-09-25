import { BookingStatus } from "@/constants/status";

export type Filters = {
  search?: string | undefined;
  category?: string | undefined;
  subjectId?: string | undefined;
  skillId?: string | undefined;
  availableToday?: string | undefined;
  availableNow?: string | undefined;
  minPrice?: string | undefined;
  maxPrice?: string | undefined;
  rating?: string | undefined;
  availability?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: string | undefined;
  page?: string | undefined;
  limit?: string | undefined;
};

export type TutorsFilter = {
  verificationStatus?: string;
  search?: string;
  page?: string;
  limit?: string;
};

export type FiltersStateProp = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export type UsersFilter = {
  search?: string;
  role?: string;
  status?: string;
  page?: string;
  limit?: string;
};

export type PaginationType = {
  totalData: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginationProps = {
  paginationInfo: PaginationType;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
};

export type BookingsFilters = {
  status?: BookingStatus | undefined;
  page?: string | undefined;
  limit?: string | undefined;
};
