"use client";

import { TaskFormType, TaskNode } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn } from "react-hook-form";
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
import { Target } from "lucide-react";
import { SetStateAction } from "jotai";


export default function TaskForm({
    form,
    onSubmit,
    close
}: {
    form: UseFormReturn<TaskFormType>
    onSubmit: (values: TaskFormType) => Promise<void>
    close?: (arg: SetStateAction<boolean>) => void
}) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Name" className="font-semibold sm:text-lg md:text-lg" {...field} />
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
                            <FormControl>
                                <Textarea className="resize-none" placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-2 flex-wrap">
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <PrioritySelect onValueChange={field.onChange} defaultValue={field.value} />
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
                                <FormControl>
                                    <DatePicker placeholder="Start date" initialDate={field.value} onChange={field.onChange} />
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
                                <FormControl>
                                    <DatePicker placeholder="Due date" icon={Target} initialDate={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Separator className="my-6" />
                <div className="w-full flex justify-between items-center gap-2">
                    <FormField
                        control={form.control}
                        name="projectId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ProjectCombobox value={field.value} setValue={form.setValue} variant="outline" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-2">
                        <CancelButton size="sm" isDirty={form.formState.isDirty} onClick={() => {
                            form.reset();
                            if (close) {
                                setTimeout(close, 0);
                            }
                        }} />
                        <Button type="submit" size="sm" onClick={() => {
                            if (close) {
                                setTimeout(close, 0);
                            }
                        }}>Submit</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}