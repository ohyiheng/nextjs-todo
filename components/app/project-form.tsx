"use client";

import { ProjectFormType } from "@/lib/definitions";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CancelButton from "./cancel-button";
import { SetStateAction } from "jotai";


export default function ProjectForm({
    form,
    onSubmit,
    close
}: {
    form: UseFormReturn<ProjectFormType>
    onSubmit: (values: ProjectFormType) => Promise<void>
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Name"
                                    className=""
                                    onFocus={e => {
                                        requestAnimationFrame(() => {
                                            e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
                                        });
                                    }}
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end items-center gap-2">
                    <CancelButton size="sm" isDirty={form.formState.isDirty} onClick={() => {
                        form.reset();
                        if (close) {
                            setTimeout(close, 0);
                        }
                    }} />
                    <Button type="submit" size="sm">Submit</Button>
                </div>
            </form>
        </Form>
    )
}