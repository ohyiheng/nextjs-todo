"use client";

import { activeProjectAtom, addTaskDialogOpenAtom } from "@/lib/atoms";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAtom, useAtomValue } from "jotai";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import PrioritySelect from "./priority-select";
import ProjectCombobox from "./project-combobox";
import TaskForm from "./task-form";
import { DatePicker } from "./date-picker";
import { SendHorizonal, Target } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CancelButton from "./cancel-button";
import { TaskFormSchema, TaskFormType } from "@/lib/definitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

const AddTaskFormSchema = z.object({
    name: z.string(),
    priority: z.literal([ '0', '1', '2', '3' ]),
    description: z.string(),
    startDate: z.date().nullable(),
    dueDate: z.date().nullable(),
    projectId: z.number(),
})

export type AddTaskFormType = z.infer<typeof AddTaskFormSchema>;

export default function AddTask() {
    const [ addTaskDialogOpen, setAddTaskDialogOpen ] = useAtom(addTaskDialogOpenAtom);
    const activeProject = useAtomValue(activeProjectAtom);

    const form = useForm<TaskFormType>({
        resolver: zodResolver(TaskFormSchema),
        defaultValues: {
            name: "",
            projectId: activeProject?.id ?? 1
        }
    })

    const onSubmit = async (values: TaskFormType) => {
        console.log("Form submitted");
    }

    const isMobile = useIsMobile();

    useEffect(() => {
        form.setValue("projectId", activeProject?.id ?? 1);
    }, [ activeProject, addTaskDialogOpen ])

    if (isMobile) return (
        <Drawer open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
            {/* "[&>button:last-child]:hidden" hides close button */}
            <DrawerContent className="px-4 mb-6 box-border sm:[&>button:last-child]:hidden focus-within:outline-none">
                <DrawerHeader className="mb-2">
                    <DrawerTitle>Add task</DrawerTitle>
                </DrawerHeader>
                <TaskForm form={form} onSubmit={onSubmit} close={() => setAddTaskDialogOpen(false)} />
            </DrawerContent>
        </Drawer>
    )

    return (
        <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
            {/* "[&>button:last-child]:hidden" hides close button */}
            <DialogContent className="sm:[&>button:last-child]:hidden">
                <DialogHeader className="mb-2">
                    <DialogTitle>Add task</DialogTitle>
                </DialogHeader>
                <TaskForm form={form} onSubmit={onSubmit} close={() => setAddTaskDialogOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}