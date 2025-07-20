"use client";

import { MouseEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Trash } from "lucide-react";

export default function DeleteButton({
    onClick,
    display = "text",
    className
}: {
    onClick: MouseEventHandler
    display?: "text" | "icon",
    className?: string
}) {
    const [ open, setOpen ] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <>
                {display === "icon" &&
                    <Button variant="ghost" size="icon" onClick={e => {
                        e.stopPropagation();
                        setOpen(true);
                    }}>
                        <Trash />
                    </Button>
                }
                {display === "text" &&
                    <p className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        setOpen(true);
                    }}>
                        Delete
                    </p>
                }
            </>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete?</DialogTitle>
                <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => {
                        setOpen(false);
                    }}>Cancel</Button>
                    <Button variant="outline" onClick={() => {
                        setTimeout(onClick, 0);
                        setOpen(false);
                    }}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}