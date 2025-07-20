"use client";

import { deleteProject, deleteTask } from "@/lib/actions";
import { Ellipsis, SquarePen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useProjects from "../providers/ProjectsProvider";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { projectEditOpenAtom, editingProjectAtom, activeProjectAtom } from "@/lib/atoms";
import { SidebarMenuAction } from "../ui/sidebar";
import { Project } from "@/lib/definitions";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function ProjectDropdown({
    project,
    inSidebar = false
}: {
    project: Project
    inSidebar?: boolean
}) {
    const { dispatch } = useProjects();
    const setProjectEditOpen = useSetAtom(projectEditOpenAtom);
    const setEditingProject = useSetAtom(editingProjectAtom);
    const activeProject = useAtomValue(activeProjectAtom);

    const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false);

    return (
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {inSidebar
                        ?
                        <SidebarMenuAction className="opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 cursor-pointer">
                            <Ellipsis />
                        </SidebarMenuAction>
                        :
                        <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <Ellipsis />
                        </Button>
                    }
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                        setEditingProject(project);
                        setProjectEditOpen(true);
                    }}>
                        <SquarePen /> Edit
                    </DropdownMenuItem>
                    <DialogTrigger asChild>
                        <DropdownMenuItem variant="destructive" onClick={() => {
                            setDeleteConfirmOpen(true);
                        }}>
                            <Trash2 /> Delete
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogFooter className="flex-row items-center justify-end gap-2">
                    <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={async () => {
                        if (dispatch) dispatch({ type: "delete", id: project.id });
                        await deleteProject(project.id);
                        if (project.id === activeProject?.id) {
                            redirect("/app/inbox");
                        }
                        setDeleteConfirmOpen(false);
                    }}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}