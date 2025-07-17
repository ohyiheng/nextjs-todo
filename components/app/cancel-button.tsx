"use client";

import { MouseEvent, MouseEventHandler, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export default function CancelButton({
    onClick,
    isDirty = true,
    size,
}: {
    onClick: MouseEventHandler
    isDirty?: boolean
    size?: "default" | "sm" | "lg" | "icon" | null
}) {
    const [ open, setOpen ] = useState(false);

    function handleClick(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(onClick, 0);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {isDirty ?
                <PopoverTrigger asChild>
                    <Button variant="ghost">Discard</Button>
                </PopoverTrigger>
                :
                <Button variant="ghost" onClick={handleClick}>Discard</Button>
            }
            <PopoverContent sideOffset={6} className="w-fit py-2 flex items-center gap-2 text-sm">
                Are you sure?
                <Button size={size} variant="secondary" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                }}>
                    No
                </Button>
                <Button size={size} variant="destructive" onClick={handleClick}>
                    Yes
                </Button>
            </PopoverContent>
        </Popover>
    )
}