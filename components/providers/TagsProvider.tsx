"use client";

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type TagsContextType = {
    tags: string[],
    setTags: Dispatch<SetStateAction<string[]>>
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export function TagsProvider({
    tags,
    children
}: {
    tags: string[],
    children: React.ReactNode
}) {
    // const [ projectList, dispatch ] = useReducer(projectsReducer, projects);
    const [ tagList, setTagList ] = useState(tags)

    return (
        <TagsContext value={{tags: tagList, setTags: setTagList}}>
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