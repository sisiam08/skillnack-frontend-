"use client";

import { getAllTutors } from "@/action/tutor.action";
import FiltersSidebar from "@/app/(CommonLayout)/_component/page/find-tutors/FilterSidebar";
import TutorCard from "@/app/(CommonLayout)/_component/page/find-tutors/TutorCard";
import Pagination from "@/components/shared/Pagination";
import Sorting from "@/components/shared/Sorting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Categories,
  Filters,
  PaginationType,
  TaxonomyItem,
  TutorProfile,
} from "@/types";
import { Menu, Search, Sparkles, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TutorsClientProps = {
  initialTutors: TutorProfile[];
  initialPagination: PaginationType;
  categories: Categories[];
  subjects: TaxonomyItem[];
  skills: TaxonomyItem[];
};

const DEFAULT_FILTERS: Filters = {
  search: undefined,
  category: undefined,
  subjectId: undefined,
  skillId: undefined,
  availableToday: undefined,
  availableNow: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  rating: undefined,
  availability: undefined,
  sortBy: undefined,
  sortOrder: undefined,
  page: "1",
  limit: "12",
};

export default function TutorsClient({
  initialTutors,
  initialPagination,
  categories,
  subjects,
  skills,
}: TutorsClientProps) {
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    limit: String(initialPagination.limit || 12),
  });
  const [searchInput, setSearchInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [tutors, setTutors] = useState<TutorProfile[]>(initialTutors);
  const [pagination, setPagination] =
    useState<PaginationType>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstFetch = useRef(true);

  useEffect(() => {
    if (isFirstFetch.current) {
      isFirstFetch.current = false;
      return;
    }

    (async () => {
      setIsLoading(true);
      const response = await getAllTutors(filters, { revalidate: 10 });

      if (!response?.data?.success) {
        setIsLoading(false);
        return;
      }

      setTutors(response.data.data.data);
      setPagination(response.data.data.pagination);
      setIsLoading(false);
    })();
  }, [filters]);

  const { totalData } = pagination;

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === pagination.page
    ) {
      return;
    }

    setFilters((prev) => ({ ...prev, page: String(nextPage) }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit: String(newLimit),
      page: "1",
    }));
  };

  const applySearchFilter = () => {
    const nextSearch = searchInput.trim() || undefined;

    setFilters((prev) => {
      if (prev.search === nextSearch && prev.page === "1") return prev;
      return {
        ...prev,
        search: nextSearch,
        page: "1",
      };
    });
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearchFilter();
  };

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      applySearchFilter();
    }, 350);

    return () => window.clearTimeout(debounceId);
  }, [searchInput]);

  const clearAllFilters = () => {
    setSearchInput("");
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      limit: prev.limit,
    }));
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.subjectId ||
    filters.skillId ||
    filters.availableToday ||
    filters.availableNow ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.rating ||
    filters.availability ||
    filters.sortBy ||
    filters.sortOrder,
  );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <Badge className="inline-flex items-center gap-2 border-orange-200 bg-orange-50 text-[#d94f0f]">
                <Sparkles className="size-3.5" />
                Find your perfect tutor
              </Badge>
              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Find The Right Tutor
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Quick comparison, expert profiles, and instant booking.
              </p>
            </div>

            <div className="shrink-0 rounded-lg border border-border/70 bg-card/70 px-3 py-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
              <span className="inline-flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <strong className="text-foreground">{totalData}</strong>{" "}
                {totalData > 1 ? "tutors" : "tutor"}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="tutor-search" className="sr-only">
              Search tutor
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="tutor-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search tutor name or skill"
                className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              className="h-10 rounded-lg px-5 text-sm bg-[#ec5b13] hover:bg-[#d94f0f]"
            >
              Search
            </Button>

            {hasActiveFilters ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg px-4 text-sm"
                onClick={clearAllFilters}
              >
                Clear
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <p className="text-xs font-medium text-muted-foreground">
            Filters & Sort
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="rounded-lg"
            aria-expanded={isFilterOpen}
            aria-controls="mobile-filter-sidebar"
            aria-label="Open filters"
          >
            {isFilterOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </Button>
        </div>

        {/* Filters - Sidebar Drawer on Mobile/Tablet */}
        <div className="lg:hidden">
          {isFilterOpen ? (
            <div
              id="mobile-filter-sidebar"
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Filters
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Collapse filters"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <FiltersSidebar
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                subjects={subjects}
                skills={skills}
              />
            </div>
          ) : null}
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <FiltersSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            subjects={subjects}
            skills={skills}
          />
        </div>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Click any card to compare and view detailed profiles.
            </p>
            <Sorting filters={filters} setFilters={setFilters} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: Math.min(pagination.limit, 6) }).map(
                (_, i) => (
                  <Card
                    key={i}
                    className="h-56 animate-pulse border-border/70"
                  />
                ),
              )}
            </div>
          ) : null}

          {!isLoading && tutors.length === 0 ? (
            <Card className="border-border/40 border-dashed bg-card/50">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <h3 className="text-lg font-semibold">No tutors found</h3>
                <p className="max-w-sm text-xs text-muted-foreground">
                  Try adjusting your filters or searching a different keyword.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearAllFilters}
                  className="mt-2"
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && tutors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tutors.map((tutor, idx) => (
                <TutorCard key={tutor.id} tutor={tutor} animationIndex={idx} />
              ))}
            </div>
          ) : null}

          {!isLoading && tutors.length > 0 && (
            <Pagination
              paginationInfo={pagination}
              handlePageChange={handlePageChange}
              handleLimitChange={handleLimitChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
