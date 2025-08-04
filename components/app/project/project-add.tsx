"use client";

import { ProjectFormSchema, ProjectFormType } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../ui/drawer";
import useProjects from "../../providers/ProjectsProvider";
import ProjectForm from "./project-form";
import { useAtom } from "jotai";
import { projectAddOpenAtom } from "@/lib/atoms";
import { useEffect } from "react";
import { addProject } from "@/lib/actions";
import { useUser } from "@/components/providers/UserProvider";

export default function ProjectAdd() {
    const [ projectAddOpen, setProjectAddOpen ] = useAtom(projectAddOpenAtom);
    const { dispatch, projects } = useProjects();
    const user = useUser();

    const form = useForm<ProjectFormType>({
        resolver: zodResolver(ProjectFormSchema),
        defaultValues: {
            id: projects.length,
            name: "",
            createdAt: new Date(),
            lastModifiedAt: new Date(),
            sortBy: "priority",
            sortOrder: "desc",
            isInbox: false
        }
    })

    async function onSubmit(values: ProjectFormType) {
        const id = await addProject({ ...values }, user);
        if (dispatch) {
            dispatch({
                type: "add",
                newValues: { ...values, id: id! }
            });
        }
        setProjectAddOpen(false);
    }

    const isMobile = useIsMobile();

    useEffect(() => {
        form.reset({
            ...form.formState.defaultValues,
            id: projects.length,
            createdAt: new Date(),
            lastModifiedAt: new Date()
        });
    }, [ projectAddOpen, form, projects.length ])

    if (isMobile) return (
        <Drawer open={projectAddOpen} onOpenChange={setProjectAddOpen}>
            <DrawerContent className="px-4 mb-6 box-border sm:[&>button:last-child]:hidden focus-within:outline-none">
                <DrawerHeader className="px-0 mb-2 flex-row justify-between items-center">
                    <DrawerTitle>Add project</DrawerTitle>
                </DrawerHeader>
                <ProjectForm form={form} onSubmit={onSubmit} close={() => setProjectAddOpen(false)} />
            </DrawerContent>
        </Drawer>
    )

    return (
        <Dialog open={projectAddOpen} onOpenChange={setProjectAddOpen}>
            <DialogContent>
                <DialogHeader className="mb-2 flex-row justify-between items-center">
                    <DialogTitle>
                        Add project
                    </DialogTitle>
                </DialogHeader>
                <ProjectForm form={form} onSubmit={onSubmit} close={() => setProjectAddOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}