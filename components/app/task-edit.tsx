"use client";

import { TaskNode } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import React, { Dispatch, useContext } from "react";
import { updateTask } from "@/lib/actions";
import { TasksDispatchContext } from "../providers/TasksContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import TaskForm from "./task-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

export const TaskFormSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    priority: z.literal([ '0', '1', '2', '3' ]),
    description: z.string(),
    startDate: z.date().nullable(),
    dueDate: z.date().nullable(),
    projectId: z.number(),
})

export type TaskFormType = z.infer<typeof TaskFormSchema>;

export default function TaskEdit({
    task,
    open,
    setOpen,
}: {
    task: TaskNode,
    open: boolean,
    setOpen: Dispatch<boolean>
}) {
    const dispatch = useContext(TasksDispatchContext);

    const form = useForm<z.infer<typeof TaskFormSchema>>({
        resolver: zodResolver(TaskFormSchema),
        defaultValues: {
            id: task.id,
            name: task.name,
            priority: task.priority,
            description: task.description,
            startDate: task.startDate,
            dueDate: task.dueDate,
            projectId: task.projectId
        }
    })

    async function onSubmit(values: z.infer<typeof TaskFormSchema>) {
        dispatch({
            type: "edit",
            newValues: values
        });
        await updateTask(values);
    }

    const isMobile = useIsMobile();

    if (isMobile) return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="px-4 mb-6 box-border sm:[&>button:last-child]:hidden focus-within:outline-none">
                <DrawerHeader>
                    <DrawerTitle>Edit task</DrawerTitle>
                </DrawerHeader>
                <TaskForm form={form} onSubmit={onSubmit} close={() => setOpen(false)} />
            </DrawerContent>
        </Drawer>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* "[&>button:last-child]:hidden" hides close button */}
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}
                className="sm:[&>button:last-child]:hidden focus-within:outline-none">
                <DialogHeader className="mb-2">
                    <DialogTitle>Edit task</DialogTitle>
                </DialogHeader>
                <TaskForm form={form} onSubmit={onSubmit} close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}