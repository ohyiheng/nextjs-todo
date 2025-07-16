"use client";

import { TaskNode } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import React, { useContext } from "react";
import ProjectCombobox from "./project-combobox";
import { DatePicker } from "./date-picker";
import { Button } from "../ui/button";
import { updateTask } from "@/lib/actions";
import { TasksDispatchContext } from "../providers/TasksContext";
import { DialogClose } from "../ui/dialog";

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

export default function TaskForm({
    task
}: {
    task: TaskNode
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
        console.log("Form submitted with values:", values);

        if (dispatch) {
            console.log("Calling dispatch...");
            dispatch({
                type: "edit",
                newValues: values
            });
            console.log("Dispatch called");
        } else {
            console.error("Dispatch is undefined!");
        }

        console.log("Calling updateTask...");
        await updateTask(values);
        console.log("updateTask completed");
    }

    return (
        <Form {...form}>
            <form onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
            }} className="h-full flex flex-col justify-between gap-6">
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea className="resize-none" placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="projectId"
                        render={({ field }) => (
                            <FormItem className="flex">
                                <FormLabel className="grow">Project</FormLabel>
                                <FormControl>
                                    <div>
                                        <ProjectCombobox value={field.value} setValue={form.setValue} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="flex">
                                <FormLabel className="grow">Priority</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">No priority</SelectItem>
                                            <SelectItem value="1">Low</SelectItem>
                                            <SelectItem value="2">Medium</SelectItem>
                                            <SelectItem value="3">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex">
                                <FormLabel className="grow">Start Date</FormLabel>
                                <FormControl>
                                    <div>
                                        <DatePicker initialDate={field.value} onChange={field.onChange} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex">
                                <FormLabel className="grow">Due Date</FormLabel>
                                <FormControl>
                                    <div>
                                        <DatePicker initialDate={field.value} onChange={field.onChange} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit" className="">Submit</Button>
                    </DialogClose>
                </div>
            </form>
        </Form>
    )
}