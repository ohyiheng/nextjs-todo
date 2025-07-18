"use client";

import { TaskFormSchema, TaskFormType, Task } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import React, { Dispatch, useContext } from "react";
import { updateTask } from "@/lib/actions";
import { TasksDispatchContext } from "../providers/TasksContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import TaskForm from "./task-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

export default function TaskEdit({
    task,
    open,
    setOpen,
}: {
    task: Task,
    open: boolean,
    setOpen: Dispatch<boolean>
}) {
    const dispatch = useContext(TasksDispatchContext);
    const form = useForm<TaskFormType>({
        resolver: zodResolver(TaskFormSchema),
        defaultValues: {
            id: task.id,
            name: task.name,
            priority: task.priority,
            description: task.description,
            startDate: task.startDate,
            dueDate: task.dueDate,
            projectId: task.projectId,
            createdAt: task.createdAt,
            lastModifiedAt: task.lastModifiedAt,
            completed: task.completed
        }
    })

    async function onSubmit(values: TaskFormType) {
        if (dispatch) {
            dispatch({
                type: "edit",
                newValues: values
            });
        }
        await updateTask(values);
        setOpen(false);
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