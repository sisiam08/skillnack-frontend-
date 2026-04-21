import { CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { AvailabilityType, UpdateAvailabilityType } from "@/types";
import { convertInto12h, timeToMinutes } from "@/helpers/TimeHelpers";
import { cn } from "@/lib/utils";

export const daysWithNumber: { [key: number]: string } = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

type AvailabilitiesProps = {
  availabilities: AvailabilityType[];
  isTutorView: boolean;
  editingSlot?: UpdateAvailabilityType | null;
  setEditingSlot?: (value: UpdateAvailabilityType | null) => void;
  handleUpdate?: () => void;
  handleToggle?: (slot: AvailabilityType) => void;
  handleDelete?: (slot: AvailabilityType) => void;
  className?: string;
};

export default function Availabilities({
  availabilities,
  isTutorView,
  editingSlot,
  setEditingSlot,
  handleUpdate,
  handleToggle,
  handleDelete,
  className,
}: AvailabilitiesProps) {
  const weekDays = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    slots: availabilities
      .filter((a) => a.dayOfWeek === i)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
  }));

  return (
    <Card
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 border-border/70 shadow-sm duration-500",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays
            className="size-4 text-brand"
            suppressHydrationWarning
          />
          Weekly Schedule
        </CardTitle>
        <CardDescription>
          {isTutorView
            ? "Manage your weekly availability. Click a slot to enable/disable or update or delete it."
            : "View the tutor's weekly availability."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {weekDays.map(({ day, slots }) => (
          <div
            key={day}
            className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 rounded-lg border border-border/80 bg-muted/15 p-3"
          >
            <p className="w-full sm:w-24 shrink-0 pt-1 font-medium">
              {daysWithNumber[day]}
            </p>

            {slots.length === 0 ? (
              <Badge className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                No slots
              </Badge>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  return isTutorView ? (
                    editingSlot && editingSlot?.id === slot.id ? (
                      <div
                        key={slot.id}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2"
                      >
                        <Input
                          type="time"
                          className="h-7 w-full sm:w-28 text-xs"
                          value={editingSlot.startTime}
                          onChange={(e) =>
                            setEditingSlot?.({
                              ...editingSlot,
                              startTime: e.target.value,
                            })
                          }
                        />
                        <span className="text-xs text-muted-foreground">–</span>
                        <Input
                          type="time"
                          className="h-7 w-full sm:w-28 text-xs"
                          value={editingSlot.endTime}
                          onChange={(e) =>
                            setEditingSlot?.({
                              ...editingSlot,
                              endTime: e.target.value,
                            })
                          }
                        />
                        <Button
                          size="sm"
                          className="h-7 w-full sm:w-auto bg-brand px-2 text-xs hover:bg-brand-strong text-white"
                          onClick={handleUpdate}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-full sm:w-auto px-2 text-xs"
                          onClick={() => setEditingSlot?.(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu key={slot.id}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                              slot.isActive
                                ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "border-muted bg-muted text-muted-foreground line-through"
                            }`}
                          >
                            {convertInto12h(slot.startTime)} –{" "}
                            {convertInto12h(slot.endTime)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={() => handleToggle?.(slot)}
                          >
                            {slot.isActive ? "Disable slot" : "Enable slot"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setEditingSlot?.({
                                id: slot.id!,
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                              })
                            }
                          >
                            Update slot
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDelete?.(slot)}
                          >
                            Delete slot
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  ) : (
                    <div key={slot.id}>
                      <Badge
                        className={
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }
                      >
                        {convertInto12h(slot.startTime)} –{" "}
                        {convertInto12h(slot.endTime)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
