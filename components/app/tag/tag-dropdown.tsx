"use client";

import { deleteTag } from "@/lib/actions";
import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { useAtomValue, useSetAtom } from "jotai";
import { tagEditOpenAtom, editingTagAtom, activeTagAtom } from "@/lib/atoms";
import { useContext, useState } from "react";
import { redirect } from "next/navigation";
import useTags from "../../providers/TagsProvider";
import { TasksDispatchContext } from "@/components/providers/TasksContext";
import { useUser } from "@/components/providers/UserProvider";

export default function TagDropdown({
    tag,
    children
}: {
    tag: string
    children: React.ReactNode
}) {
    const { tags, setTags } = useTags();
    const setTagEditOpen = useSetAtom(tagEditOpenAtom);
    const setEditingTag = useSetAtom(editingTagAtom);
    const activeTag = useAtomValue(activeTagAtom);
    const user = useUser();

    const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false);

    const dispatch = useContext(TasksDispatchContext);

    return (
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                        setEditingTag(tag);
                        setTagEditOpen(true);
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
                        setTags(tags.filter(t => t !== tag));
                        if (dispatch) dispatch({ type: "delete-tag", id: tag })
                        await deleteTag(tag, user);
                        if (tag === activeTag) {
                            redirect("/app/inbox");
                        }
                        setDeleteConfirmOpen(false);
                    }}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}