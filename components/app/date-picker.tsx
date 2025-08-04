"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { OnSelectHandler } from "react-day-picker";

export function DatePicker({
    initialDate,
    onChange,
    placeholder = "Pick a date",
    icon: Icon = CalendarIcon,
    size = "default"
}: {
    initialDate: Date | null,
    onChange: OnSelectHandler<Date | undefined>,
    placeholder?: string
    icon?: LucideIcon,
    size?: "default" | "sm"
}) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size={size} className="cursor-pointer font-normal text-sm" onClick={e => e.stopPropagation()}>
                    <Icon strokeWidth="1.5px" className="opacity-50" />
                    {initialDate ? initialDate.toLocaleDateString() : <span className="text-muted-foreground">{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent onClick={e => e.stopPropagation()} className="p-0 w-full">
                <Calendar buttonVariant="outline" mode="single" required={false} selected={initialDate ?? undefined} onSelect={onChange} captionLayout="dropdown" />
            </PopoverContent>
        </Popover>
    )
}