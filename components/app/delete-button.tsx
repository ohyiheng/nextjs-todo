"use client";

import { MouseEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Trash, Trash2 } from "lucide-react";

export default function DeleteButton({
    onClick,
    children
}: {
    onClick: MouseEventHandler
    children: React.ReactNode
}) {
    const [ open, setOpen ] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete?</DialogTitle>
                <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary" onClick={() => {
                        setOpen(false);
                    }}>Cancel</Button>
                    <Button variant="destructive" onClick={() => {
                        setTimeout(onClick, 0);
                        setOpen(false);
                    }}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}