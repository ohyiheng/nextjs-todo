"use client";

import { activeProjectAtom, activeTagAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import ProjectDropdown from "./project/project-dropdown";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import useProjects from "../providers/ProjectsProvider";
import TagDropdown from "./tag/tag-dropdown";

export default function MainMoreOptions() {
    const activeProject = useAtomValue(activeProjectAtom);
    const activeTag = useAtomValue(activeTagAtom);
    const { inboxId } = useProjects();

    if (activeProject && activeProject?.id !== inboxId) return (
        <ProjectDropdown project={activeProject}>
            <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
            }}>
                <Ellipsis />
            </Button>
        </ProjectDropdown>

    )
    if (activeTag) return (
        <TagDropdown tag={activeTag}>
            <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
            }}>
                <Ellipsis />
            </Button>
        </TagDropdown>
    )
    return undefined;
}