import { format, parse } from "date-fns";

export const convertInto12h = (time: string) => {
  return format(parse(time, "HH:mm", new Date()), "hh:mm a");
};


export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};