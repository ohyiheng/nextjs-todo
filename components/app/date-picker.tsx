"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";

export function DatePicker({
    initialDate,
    onChange,
    size = "default"
}: {
    initialDate: Date | null,
    onChange: (...event: any[]) => void,
    size?: "default" | "sm"
}) {
    // const [ date, setDate ] = useState<Date | undefined>(initialDate);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size={size} className="cursor-pointer font-normal text-sm" onClick={e => e.stopPropagation()}>
                    <CalendarIcon strokeWidth="1.5px" className="p-[1.5px]" />
                    {initialDate ? format(initialDate, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent onClick={e => e.stopPropagation()} className="p-0 w-full">
                <Calendar buttonVariant="outline" mode="single" required={false} selected={initialDate ?? undefined} onSelect={onChange} captionLayout="dropdown" />
            </PopoverContent>
        </Popover>
    )
}