"use client";

import { TaskNode } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import React, { useContext, useState } from "react";
import ProjectCombobox from "./project-combobox";
import { DatePicker } from "./date-picker";
import { Button } from "../ui/button";
import { updateTask } from "@/lib/actions";
import { TasksDispatchContext } from "../providers/TasksContext";
import { DialogClose } from "../ui/dialog";
import PrioritySelect from "./priority-select";
import { Separator } from "../ui/separator";
import CancelButton from "./cancel-button";
import TaskForm from "./task-form";

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
    close
}: {
    task: TaskNode,
    close?: () => void
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

    return (
        <TaskForm form={form} onSubmit={onSubmit} close={close} />
    )
}