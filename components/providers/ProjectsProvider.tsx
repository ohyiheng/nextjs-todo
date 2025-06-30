"use client";

import { ProjectNode } from "@/lib/definitions";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, useContext, useReducer } from "react";

type ProjectsAction = {
    type: "move",
    oldIndex: number,
    newIndex: number
}

type ProjectsContextType = {
    projects: ProjectNode[],
    dispatch: Dispatch<ProjectsAction>
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({
    projects, 
    children
}: {
    projects: ProjectNode[],
    children: React.ReactNode
}) {
    const [ projectList, dispatch ] = useReducer(projectsReducer, projects);

    return (
        <ProjectsContext value={{ projects: projectList, dispatch: dispatch}}>
            {children}
        </ProjectsContext>
    )
}

function projectsReducer(prevProjects: ProjectNode[], action: ProjectsAction) {
    if (!prevProjects) {
        return [];
    }
    switch (action.type) {
        case "move": {
            return arrayMove(prevProjects, action.oldIndex, action.newIndex);
        }
    }
}

export default function useProjects() {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error("useProjects must be used within a ProjectsProvider");
    }
    return context;
}