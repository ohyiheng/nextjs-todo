"use client";

import { ProjectFormSchema, ProjectFormType } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../ui/drawer";
import DeleteButton from "../delete-button";
import useProjects from "../../providers/ProjectsProvider";
import ProjectForm from "./project-form";
import { useAtom, useAtomValue } from "jotai";
import { activeProjectAtom, editingProjectAtom, projectEditOpenAtom } from "@/lib/atoms";
import { useEffect, useState } from "react";
import { deleteProject, deleteTask, updateProject } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { redirect } from "next/navigation";

export default function ProjectEdit() {
    const [ projectEditOpen, setProjectEditOpen ] = useAtom(projectEditOpenAtom);
    const editingProject = useAtomValue(editingProjectAtom);
    const activeProject = useAtomValue(activeProjectAtom);
    const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false);

    const { dispatch } = useProjects();

    const form = useForm<ProjectFormType>({
        resolver: zodResolver(ProjectFormSchema),
        defaultValues: {
            id: editingProject?.id,
            name: editingProject?.name,
        }
    })

    async function onSubmit(values: ProjectFormType) {
        if (dispatch) {
            dispatch({
                type: "edit",
                newValues: values
            });
        }
        await updateProject(values);
        setProjectEditOpen(false);
    }

    const isMobile = useIsMobile();

    useEffect(() => {
        if (editingProject) {
            form.reset({
                id: editingProject?.id,
                name: editingProject?.name,
            });
        }
    }, [ editingProject ])

    if (!editingProject) return null;
    if (isMobile) return (
        <Drawer open={projectEditOpen} onOpenChange={setProjectEditOpen}>
            <DrawerContent className="px-4 mb-6 box-border sm:[&>button:last-child]:hidden focus-within:outline-none">
                <DrawerHeader className="px-0 mb-2 flex-row justify-between items-center">
                    <DrawerTitle>Edit project</DrawerTitle>
                    <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost"><Trash2 /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogFooter className="flex-row items-center justify-end gap-2">
                                <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={async () => {
                                    if (dispatch) dispatch({ type: "delete", id: editingProject.id });
                                    await deleteProject(editingProject.id);

                                    setDeleteConfirmOpen(false);
                                    setProjectEditOpen(false);
                                    if (editingProject.id === activeProject?.id) {
                                        redirect("/app/inbox");
                                    }
                                }}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DrawerHeader>
                <ProjectForm form={form} onSubmit={onSubmit} close={() => setProjectEditOpen(false)} />
            </DrawerContent>
        </Drawer>
    )

    return (
        <Dialog open={projectEditOpen} onOpenChange={setProjectEditOpen}>
            <DialogContent>
                <DialogHeader className="mb-2 flex-row justify-between items-center">
                    <DialogTitle>
                        Edit project
                    </DialogTitle>
                </DialogHeader>
                <ProjectForm form={form} onSubmit={onSubmit} close={() => setProjectEditOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}