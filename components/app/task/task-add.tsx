"use client";

import { activeProjectAtom, activeTagAtom, addTaskDialogOpenAtom } from "@/lib/atoms";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { useAtom, useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TaskForm from "./task-form";
import { useContext, useEffect } from "react";
import { TaskFormSchema, TaskFormType } from "@/lib/definitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../ui/drawer";
import { TasksDispatchContext } from "../../providers/TasksContext";
import { uuidv4 } from "@/lib/utils";
import { addTask } from "@/lib/actions";
import { usePathname } from "next/navigation";
import { useUser } from "../../providers/UserProvider";
import useProjects from "../../providers/ProjectsProvider";

export default function AddTask() {
    const [ addTaskDialogOpen, setAddTaskDialogOpen ] = useAtom(addTaskDialogOpenAtom);
    const activeProject = useAtomValue(activeProjectAtom);
    const { inboxId } = useProjects();
    const activeTag = useAtomValue(activeTagAtom);
    const dispatch = useContext(TasksDispatchContext);
    const pathname = usePathname();
    const page = pathname?.split('/')[ 2 ];
    const user = useUser();

    const form = useForm<TaskFormType>({
        resolver: zodResolver(TaskFormSchema),
        defaultValues: {
            id: uuidv4(),
            name: "",
            description: undefined,
            priority: '0',
            projectId: activeProject?.id ?? inboxId,
            startDate: page === "today" ? new Date() : null,
            dueDate: null,
            createdAt: new Date(),
            lastModifiedAt: new Date(),
            completed: false,
            tags: page === "tag" ? [ pathname?.split('/')[ 3 ] ] : []
        }
    })

    const onSubmit = async (values: TaskFormType) => {
        if (dispatch) {
            dispatch({ type: "add", newValues: values });
        } else {
            console.log("dispatch function undefined");
        }
        await addTask(values, user);
        setAddTaskDialogOpen(false);
    }

    const isMobile = useIsMobile();

    useEffect(() => {
        form.setValue("projectId", activeProject?.id ?? inboxId);
    }, [ activeProject, form, inboxId ])

    useEffect(() => {
        form.reset();
        form.setValue("id", uuidv4()); // refresh UUID whenever dialog opens/closes
        form.setValue("projectId", activeProject?.id ?? inboxId);
        form.setValue("startDate", page === "today" ? new Date() : null);
        form.setValue("tags", activeTag ? [ activeTag ] : []);
    }, [ addTaskDialogOpen, form, activeProject, page, inboxId, activeTag ])

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