"use client";

import { TaskFormSchema, TaskFormType, Task } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import React, { Dispatch, useContext, useState } from "react";
import { deleteTask, updateTask } from "@/lib/actions";
import { TasksDispatchContext } from "../providers/TasksContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import TaskForm from "./task-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useUser } from "../providers/UserProvider";

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
    const user = useUser();

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
            completed: task.completed,
            tags: task.tags
        }
    })

    async function onSubmit(values: TaskFormType) {
        if (dispatch) {
            dispatch({
                type: "edit",
                newValues: values
            });
        }
        await updateTask(values, user);
        setOpen(false);
    }

    const isMobile = useIsMobile();
    const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false);

    if (isMobile) return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="px-4 mb-6 box-border sm:[&>button:last-child]:hidden focus-within:outline-none">
                <DrawerHeader className="px-0 mb-2 flex-row justify-between items-center">
                    <DrawerTitle>Edit task</DrawerTitle>
                    <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost"><Trash2 /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogFooter className="flex-row items-center justify-end gap-2">
                                <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={async () => {
                                    if (dispatch) dispatch({ type: "delete", id: task.id });
                                    await deleteTask(task.id);
                                    setDeleteConfirmOpen(false);
                                }}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DrawerHeader>
                <TaskForm form={form} onSubmit={onSubmit} close={() => setOpen(false)} />
            </DrawerContent>
        </Drawer>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader className="mb-2 flex-row justify-between items-center">
                    <DialogTitle>
                        Edit task
                    </DialogTitle>
                </DialogHeader>
                <TaskForm form={form} onSubmit={onSubmit} close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}