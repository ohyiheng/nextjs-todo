"use client";

import { activeProjectAtom, activeTagAtom } from "@/lib/atoms";
import { getProjectById } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { usePathname } from "next/navigation";
import useProjects from "../providers/ProjectsProvider";
import { useEffect } from "react";

// updates the activeProject global state using url path
export default function ActiveItemUpdater() {
    const pathname = usePathname();
    const setActiveProject = useSetAtom(activeProjectAtom);
    const { projects } = useProjects();
    const setActiveTag = useSetAtom(activeTagAtom);

    console.log(projects);

    const pathList = pathname.split('/').slice(2);
    useEffect(() => {
        setActiveTag(null);
        setActiveProject(null);
        
        if (pathList[ 0 ] === "inbox") {
            setActiveProject(getProjectById(projects, 1) ?? null);
        } else if (pathList[ 0 ] === "project") {
            if (pathList.length > 1) {
                setActiveProject(getProjectById(projects, parseInt(pathList[ 1 ])) ?? null);
            }
        } else if (pathList[ 0 ] === "tag") {
            if (pathList.length > 1) {
                setActiveTag(pathList[1]);
            }
        }
    })

    return <></>;
}