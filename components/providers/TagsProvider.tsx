"use client";

import { Tag } from "@/lib/definitions";
import { createContext, useContext, useState } from "react";

// type ProjectsAction = {
//     type: "move",
//     oldIndex: number,
//     newIndex: number
// } | {
//     type: "edit" | "add",
//     newValues: ProjectFormType
// } | {
//     type: "delete",
//     id: number
// }

const TagsContext = createContext<Tag[] | undefined>(undefined);

export function TagsProvider({
    tags,
    children
}: {
    tags: Tag[],
    children: React.ReactNode
}) {
    // const [ projectList, dispatch ] = useReducer(projectsReducer, projects);
    const [ tagList, setTagList ] = useState(tags)

    return (
        <TagsContext value={tagList}>
            {children}
        </TagsContext>
    )
}

export default function useTags() {
    const context = useContext(TagsContext);
    if (!context) {
        throw new Error("useTags must be used within a TagsProvider");
    }
    return context;
}