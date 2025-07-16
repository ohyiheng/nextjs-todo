"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, Target } from "lucide-react";
import { Button } from "../ui/button";

export function DatePicker({
    initialDate,
    onChange,
    icon = "calendar",
    size = "default"
}: {
    initialDate: Date | null,
    onChange: (...event: any[]) => void,
    icon?: "target" | "calendar",
    size?: "default" | "sm"
}) {
    // const [ date, setDate ] = useState<Date | undefined>(initialDate);
    const icons = {
        "target": Target,
        "calendar": CalendarIcon
    }

    const IconComponent = Object.entries(icons).find(obj => obj[0] === icon)![1];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size={size} className="cursor-pointer font-normal text-sm" onClick={e => e.stopPropagation()}>
                    <IconComponent strokeWidth="1.5px" className="p-[1.5px]" />
                    {initialDate ? initialDate.toLocaleDateString() : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent onClick={e => e.stopPropagation()} className="p-0 w-full">
                <Calendar buttonVariant="outline" mode="single" required={false} selected={initialDate ?? undefined} onSelect={onChange} captionLayout="dropdown" />
            </PopoverContent>
        </Popover>
    )
}