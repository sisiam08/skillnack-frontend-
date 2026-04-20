import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationProps } from "@/types";

const LIMIT_OPTIONS = [5, 10, 20, 50];

const getPageNumbers = (current: number, total: number) => {
  if (total <= 1) return [];

  const pages = [1];

  // left ellipsis
  if (current > 2) pages.push(-1);

  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 1 && i < total) pages.push(i);
  }

  // right ellipsis
  if (current < total - 1) pages.push(-2);

  if (total > 1) pages.push(total);

  return [...new Set(pages)];
};

export default function Pagination({
  paginationInfo,
  handlePageChange,
  handleLimitChange,
}: PaginationProps) {
  const { page, totalPages, limit, totalData } = paginationInfo;

  if (!totalPages || totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
      {/* Limit Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600 dark:text-slate-400">Show</span>
        <Select
          value={String(limit)}
          onValueChange={(value) => handleLimitChange(Number(value))}
        >
          <SelectTrigger className="w-20 h-10 bg-white dark:bg-background border-primary/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          of {totalData}
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Previous */}
        <Button
          type="button"
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="flex size-10 items-center justify-center rounded-lg border border-primary/10 bg-white dark:bg-background text-slate-700 dark:text-slate-200 transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </Button>

        {/* Pages */}
        {pageNumbers.map((num, index) => {
          if (num < 0) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-slate-400 dark:text-slate-500"
              >
                ...
              </span>
            );
          }

          const isActive = num === page;

          return (
            <Button
              key={num}
              type="button"
              disabled={isActive}
              onClick={() => handlePageChange(num)}
              className={
                isActive
                  ? "flex size-10 items-center justify-center rounded-lg bg-brand font-bold text-white disabled:cursor-default disabled:opacity-100"
                  : "flex size-10 items-center justify-center rounded-lg border border-primary/10 bg-white dark:bg-background text-slate-700 dark:text-slate-200 transition-colors hover:bg-primary/5"
              }
            >
              {num}
            </Button>
          );
        })}

        {/* Next */}
        <Button
          type="button"
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="flex size-10 items-center justify-center rounded-lg border border-primary/10 bg-white dark:bg-background text-slate-700 dark:text-slate-200 transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </Button>
      </div>
    </div>
  );
}

