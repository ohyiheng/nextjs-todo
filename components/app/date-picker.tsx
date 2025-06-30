"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";

export function DatePickerChip({
    initialDate
}: {
    initialDate?: Date
}) {
    const [date, setDate] = useState<Date | undefined>(initialDate ?? undefined);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer font-normal text-sm">
                    <CalendarIcon strokeWidth="1.5px" className="p-[1.5px]" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full">
                <Calendar buttonVariant="outline" mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" />
            </PopoverContent>
        </Popover>
    )
}