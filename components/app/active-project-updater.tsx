"use client";

import { activeProjectAtom } from "@/lib/atoms";
import { getProjectById } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { usePathname } from "next/navigation";
import useProjects from "../providers/ProjectsProvider";
import { useEffect } from "react";

// updates the activeProject global state using url path
export default function ActiveProjectUpdater() {
    const pathname = usePathname();
    const setActiveProject = useSetAtom(activeProjectAtom);
    const { projects } = useProjects();

    const pathList = pathname.split('/').slice(2);
    useEffect(() => {
        if (pathList[ 0 ] === "inbox") {
            setActiveProject(getProjectById(projects, 1));
        } else if (pathList[ 0 ] === "project") {
            if (pathList.length > 1) {
                setActiveProject(getProjectById(projects, parseInt(pathList[ 1 ])));
            }
        } else {
            setActiveProject(null);
        }
    })

    return <></>;
}