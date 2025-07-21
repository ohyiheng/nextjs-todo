"use client";

import { activeProjectAtom, addTaskDialogOpenAtom } from "@/lib/atoms";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAtom, useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TaskForm from "./task-form";
import { useContext, useEffect } from "react";
import { TaskFormSchema, TaskFormType } from "@/lib/definitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { TasksDispatchContext } from "../providers/TasksContext";
import { uuidv4 } from "@/lib/utils";
import { addTask } from "@/lib/actions";
import { usePathname } from "next/navigation";

export default function AddTask() {
    const [ addTaskDialogOpen, setAddTaskDialogOpen ] = useAtom(addTaskDialogOpenAtom);
    const activeProject = useAtomValue(activeProjectAtom);
    const dispatch = useContext(TasksDispatchContext);
    const pathname = usePathname();
    const onTodayPage = pathname.split('/')[2] === "today";

    const newDate = new Date();

    const form = useForm<TaskFormType>({
        resolver: zodResolver(TaskFormSchema),
        defaultValues: {
            id: uuidv4(),
            name: "",
            description: undefined,
            priority: '0',
            projectId: activeProject?.id ?? 1,
            startDate: onTodayPage ? newDate : null,
            dueDate: null,
            createdAt: newDate,
            lastModifiedAt: newDate,
            completed: false
        }
    })

    const onSubmit = async (values: TaskFormType) => {
        console.log(values);
        if (dispatch) {
            dispatch({ type: "add", newValues: values });
        } else {
            console.log("dispatch function undefined");
        }
        await addTask(values);
        setAddTaskDialogOpen(false);
    }

    const isMobile = useIsMobile();

    useEffect(() => {
        form.setValue("projectId", activeProject?.id ?? 1);
    }, [ activeProject ])

    useEffect(() => {
        form.reset();
        form.setValue("id", uuidv4()); // refresh UUID whenever dialog opens/closes
        form.setValue("projectId", activeProject?.id ?? 1);
    }, [ addTaskDialogOpen ])

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