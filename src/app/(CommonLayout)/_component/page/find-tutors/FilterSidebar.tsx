"use client";

import { Categories, Filters, FiltersStateProp, TaxonomyItem } from "@/types";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FiltersSidebarProps = FiltersStateProp & {
  categories: Categories[];
  subjects: TaxonomyItem[];
  skills: TaxonomyItem[];
};

export default function FiltersSidebar({
  filters,
  setFilters,
  categories,
  subjects,
  skills,
}: FiltersSidebarProps) {
  const minPriceValue = Number(filters.minPrice ?? "0");
  const maxPriceValue = Number(filters.maxPrice ?? "1000");

  const days = [
    { label: "Sun", value: "sun", dayOfWeek: "0" },
    { label: "Mon", value: "mon", dayOfWeek: "1" },
    { label: "Tue", value: "tue", dayOfWeek: "2" },
    { label: "Wed", value: "wed", dayOfWeek: "3" },
    { label: "Thu", value: "thu", dayOfWeek: "4" },
    { label: "Fri", value: "fri", dayOfWeek: "5" },
    { label: "Sat", value: "sat", dayOfWeek: "6" },
  ];

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Filters
          </h2>
          <Button
            className="text-xs font-medium text-primary bg-white dark:bg-card hover:bg-gray-100 dark:hover:bg-muted"
            onClick={() => {
              setFilters({
                search: undefined,
                category: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                rating: undefined,
                availability: undefined,
                sortBy: undefined,
                sortOrder: undefined,
                page: "1",
                limit: "12",
              });
            }}
          >
            Reset All
          </Button>
        </div>

        {/* Instant availability */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Availability
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={
                filters.availableToday === "true" ? "default" : "outline"
              }
              onClick={() =>
                setFilters((prev: Filters) => ({
                  ...prev,
                  availableToday:
                    prev.availableToday === "true" ? undefined : "true",
                  page: "1",
                }))
              }
              className={
                filters.availableToday === "true"
                  ? "bg-brand text-white hover:bg-brand-strong"
                  : ""
              }
            >
              Available today
            </Button>
            <Button
              type="button"
              variant={filters.availableNow === "true" ? "default" : "outline"}
              onClick={() =>
                setFilters((prev: Filters) => ({
                  ...prev,
                  availableNow:
                    prev.availableNow === "true" ? undefined : "true",
                  page: "1",
                }))
              }
              className={
                filters.availableNow === "true"
                  ? "bg-brand text-white hover:bg-brand-strong"
                  : ""
              }
            >
              Within 2 hours
            </Button>
          </div>
        </div>

        {/* Category filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Category
          </h3>

          <RadioGroup
            value={filters.category ?? ""}
            onValueChange={(value) =>
              setFilters((prev: Filters) => ({
                ...prev,
                category: value || undefined,
                page: "1",
              }))
            }
            className="flex flex-col gap-2"
          >
            {categories.map((cat: Categories, index) => {
              const categoryName = cat.name?.trim();
              if (!categoryName) return null;

              const categoryId = `category-${cat.id ?? index}`;

              return (
                <div
                  key={cat.id ?? categoryName}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-primary/5 cursor-pointer"
                  onClick={() =>
                    setFilters((prev: Filters) => ({
                      ...prev,
                      category: categoryName,
                      page: "1",
                    }))
                  }
                >
                  <RadioGroupItem
                    value={categoryName}
                    id={categoryId}
                    className="border-primary/30 text-primary"
                  />
                  <Label
                    htmlFor={categoryId}
                    className="text-sm font-medium cursor-pointer text-slate-800 dark:text-slate-200"
                  >
                    {categoryName}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Subject filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Subject
          </h3>
          <Select
            value={filters.subjectId ?? "all"}
            onValueChange={(value) =>
              setFilters((prev: Filters) => ({
                ...prev,
                subjectId: value === "all" ? undefined : value,
                page: "1",
              }))
            }
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skill filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Skill
          </h3>
          <Select
            value={filters.skillId ?? "all"}
            onValueChange={(value) =>
              setFilters((prev: Filters) => ({
                ...prev,
                skillId: value === "all" ? undefined : value,
                page: "1",
              }))
            }
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="All skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All skills</SelectItem>
              {skills.map((skill) => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price range slider */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Price per hour
          </h3>

          <div className="px-2 space-y-4">
            <Slider
              value={[minPriceValue, maxPriceValue]}
              onValueChange={(value) =>
                setFilters((prev: Filters) => ({
                  ...prev,
                  minPrice: value[0].toString(),
                  maxPrice: value[1].toString(),
                  page: "1",
                }))
              }
              max={1000}
              step={50}
              className="cursor-pointer"
            />

            <div className="flex justify-between text-xs font-medium">
              <span className="rounded bg-primary/10 px-2 py-1 text-slate-800 dark:text-slate-200">
                {minPriceValue}/hr
              </span>
              <span className="rounded bg-primary/10 px-2 py-1 text-slate-800 dark:text-slate-200">
                {maxPriceValue}/hr
              </span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Rating
          </h3>

          <RadioGroup
            value={filters.rating ?? ""}
            onValueChange={(value) =>
              setFilters((prev: Filters) => ({
                ...prev,
                rating: value || undefined,
                page: "1",
              }))
            }
          >
            <div
              className="flex items-center gap-3 rounded-lg border border-primary/10 dark:border-primary/25 p-3 transition-colors hover:border-primary/40 cursor-pointer"
              onClick={() =>
                setFilters((prev: Filters) => ({
                  ...prev,
                  rating: "5",
                  page: "1",
                }))
              }
            >
              <RadioGroupItem value="5" id="r1" />
              <Label
                htmlFor="r1"
                className="text-sm font-medium cursor-pointer text-slate-800 dark:text-slate-200"
              >
                5 only
              </Label>
            </div>

            <div
              className="flex items-center gap-3 rounded-lg border border-primary/10 dark:border-primary/25 p-3 transition-colors hover:border-primary/40 cursor-pointer"
              onClick={() =>
                setFilters((prev: Filters) => ({
                  ...prev,
                  rating: "4",
                  page: "1",
                }))
              }
            >
              <RadioGroupItem value="4" id="r2" />
              <Label
                htmlFor="r2"
                className="text-sm font-medium cursor-pointer text-slate-800 dark:text-slate-200"
              >
                4 & up
              </Label>
            </div>

            <div
              className="flex items-center gap-3 rounded-lg border border-primary/10 dark:border-primary/25 p-3 transition-colors hover:border-primary/40 cursor-pointer"
              onClick={() =>
                setFilters((prev: Filters) => ({
                  ...prev,
                  rating: "3",
                  page: "1",
                }))
              }
            >
              <RadioGroupItem value="3" id="r3" />
              <Label
                htmlFor="r3"
                className="text-sm font-medium cursor-pointer text-slate-800 dark:text-slate-200"
              >
                3 & up
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Availability (Select a Day)
          </h3>

          <ToggleGroup
            type="single"
            value={filters.availability ?? ""}
            onValueChange={(value) =>
              setFilters((prev: Filters) => ({
                ...prev,
                availability: value || undefined,
                page: "1",
              }))
            }
            className="flex flex-wrap gap-2 justify-start"
          >
            {days.map((d) => (
              <ToggleGroupItem
                key={d.value}
                value={d.dayOfWeek}
                className="
              rounded-full
              border border-primary/20
              bg-white dark:bg-background
              px-3 py-1
              text-xs font-medium
              transition-all
              hover:bg-brand hover:text-white hover:border-brand
              data-[state=on]:bg-brand-strong data-[state=on]:border-brand
              data-[state=on]:text-white
            "
              >
                {d.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </aside>
  );
}
