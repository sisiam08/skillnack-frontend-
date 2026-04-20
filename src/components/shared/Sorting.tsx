import { FiltersStateProp } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Sorting({ filters, setFilters }: FiltersStateProp) {
  const sortOptions = [
    {
      label: "Most Booked",
      sortBy: "totalCompletedBookings",
      sortOrder: "desc",
    },
    { label: "Price: Low to High", sortBy: "hourlyRate", sortOrder: "asc" },
    { label: "Price: High to Low", sortBy: "hourlyRate", sortOrder: "desc" },
    { label: "Rating", sortBy: "totalRating", sortOrder: "desc" },
  ];
  return (
    <Select
      value={
        filters.sortBy && filters.sortOrder
          ? `${filters.sortBy}-${filters.sortOrder}`
          : undefined
      }
      onValueChange={(value) => {
        const [sortBy, sortOrder] = value.split("-");

        setFilters((prev) => ({
          ...prev,
          sortBy,
          sortOrder: sortOrder as "asc" | "desc",
          page: "1",
        }));
      }}
    >
      <SelectTrigger className="w-full sm:w-56 rounded-xl">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>

      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem
            key={option.label}
            value={`${option.sortBy}-${option.sortOrder}`}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

