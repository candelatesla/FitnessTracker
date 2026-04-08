"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getIsoDate } from "@/lib/fitness";

export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-h-11 justify-start rounded-2xl">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(parseISO(value), "MMMM d, yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-white/10 bg-[#111111] p-2">
        <Calendar
          mode="single"
          selected={parseISO(value)}
          onSelect={(date) => date && onChange(getIsoDate(date))}
        />
      </PopoverContent>
    </Popover>
  );
}
