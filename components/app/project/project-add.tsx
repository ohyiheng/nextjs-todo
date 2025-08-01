"use client";

import { ProjectFormSchema, ProjectFormType } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../ui/drawer";
import useProjects from "../../providers/ProjectsProvider";
import ProjectForm from "./project-form";
import { useAtom } from "jotai";
import { activeProjectAtom, projectAddOpenAtom } from "@/lib/atoms";
import { useEffect, useState } from "react";
import { addProject } from "@/lib/actions";
import { getNextProjectId } from "@/lib/actions";

export default function ProjectAdd() {
    const [ projectAddOpen, setProjectAddOpen ] = useAtom(projectAddOpenAtom);

    const { dispatch, projects } = useProjects();

    const form = useForm<ProjectFormType>({
        resolver: zodResolver(ProjectFormSchema),
        defaultValues: {
            id: projects.length,
            name: "",
        }
    })

    async function onSubmit(values: ProjectFormType) {
        const id = await getNextProjectId();
        if (dispatch) {
            dispatch({
                type: "add",
                newValues: { ...values, id: id }
            });
        }
        await addProject({ ...values, id: id });
        setProjectAddOpen(false);
    }

    const isMobile = useIsMobile();

    useEffect(() => {
        form.reset();
        form.setValue("id", projects.length);
    }, [ projectAddOpen ])

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