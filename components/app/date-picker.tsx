"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";

export function DatePicker({
    initialDate,
    size = "default"
}: {
    initialDate: Date | undefined,
    size?: "default" | "sm"
}) {
    const [ date, setDate ] = useState<Date | undefined>(initialDate);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size={size} className="cursor-pointer font-normal text-sm" onClick={e => e.stopPropagation()}>
                    <CalendarIcon strokeWidth="1.5px" className="p-[1.5px]" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent onClick={e => e.stopPropagation()} className="p-0 w-full">
                <Calendar buttonVariant="outline" mode="single" required={false} selected={date} onSelect={setDate} captionLayout="dropdown" />
            </PopoverContent>
        </Popover>
    )
}