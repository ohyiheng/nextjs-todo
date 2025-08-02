"use client";

import { TagFormSchema, TagFormType } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../ui/drawer";
import TagForm from "./tag-form";
import { useAtom, useAtomValue } from "jotai";
import { activeTagAtom, editingTagAtom, tagEditOpenAtom } from "@/lib/atoms";
import { useContext, useEffect, useState } from "react";
import { editTag } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { redirect } from "next/navigation";
import useTags from "@/components/providers/TagsProvider";
import { TasksDispatchContext } from "@/components/providers/TasksContext";
import { useUser } from "@/components/providers/UserProvider";

export default function TagEdit() {
    const { tags, setTags } = useTags();
    const [ tagEditOpen, setTagEditOpen ] = useAtom(tagEditOpenAtom);
    const editingTag = useAtomValue(editingTagAtom);
    const activeTag = useAtomValue(activeTagAtom);
    const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false);
    const dispatch = useContext(TasksDispatchContext);
    const user = useUser();

    const form = useForm<TagFormType>({
        resolver: zodResolver(TagFormSchema),
        defaultValues: {
            value: editingTag ?? undefined
        }
    })

    async function onSubmit(values: TagFormType) {
        const tagAlreadyExists = tags.includes(values.value);
        if (tagAlreadyExists) {
            setTags(tags.filter(tag => tag !== editingTag!));
        } else {
            setTags(tags.map(tag => {
                if (tag === editingTag!) {
                    return values.value;
                } else {
                    return tag;
                }
            }))
        }

        if (dispatch) {
            dispatch({ type: "rename-tag", oldTag: editingTag!, newTag: values.value })
        }
        await editTag(editingTag!, values.value, user, tagAlreadyExists)

        setTagEditOpen(false);
        if (editingTag === activeTag) {
            redirect(`/app/tag/${values.value}`);
        }
    }

    const isMobile = useIsMobile();

    useEffect(() => {
        if (editingTag) {
            form.reset({
                value: editingTag ?? undefined
            });
        }
    }, [ editingTag ])

    if (!editingTag) return null;
    if (isMobile) return (
        <Drawer open={tagEditOpen} onOpenChange={setTagEditOpen}>
            <DrawerContent className="px-4 mb-6 box-border sm:[&>button:last-child]:hidden focus-within:outline-none">
                <DrawerHeader className="px-0 mb-2 flex-row justify-between items-center">
                    <DrawerTitle>Edit tag</DrawerTitle>
                    <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost"><Trash2 /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogFooter className="flex-row items-center justify-end gap-2">
                                <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={async () => {
                                    // if (dispatch) dispatch({ type: "delete", id: editingTag.id });
                                    // await deleteProject(editingTag.id);

                                    setDeleteConfirmOpen(false);
                                    setTagEditOpen(false);
                                    // if (editingTag.id === activeTag?.id) {
                                    //     redirect("/app/inbox");
                                    // }
                                }}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DrawerHeader>
                <TagForm form={form} onSubmit={onSubmit} close={() => setTagEditOpen(false)} />
            </DrawerContent>
        </Drawer>
    )

    return (
        <Dialog open={tagEditOpen} onOpenChange={setTagEditOpen}>
            <DialogContent>
                <DialogHeader className="mb-2 flex-row justify-between items-center">
                    <DialogTitle>
                        Edit tag
                    </DialogTitle>
                </DialogHeader>
                <TagForm form={form} onSubmit={onSubmit} close={() => setTagEditOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}