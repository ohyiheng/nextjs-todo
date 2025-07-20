"use client";

import { ProjectFormType, Project } from "@/lib/definitions";
import { getProjectById } from "@/lib/utils";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, useContext, useReducer } from "react";

type ProjectsAction = {
    type: "move",
    oldIndex: number,
    newIndex: number
} | {
    type: "edit",
    newValues: ProjectFormType
} | {
    type: "delete",
    id: number
}

type ProjectsContextType = {
    projects: Project[],
    dispatch: Dispatch<ProjectsAction>
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({
    projects,
    children
}: {
    projects: Project[],
    children: React.ReactNode
}) {
    const [ projectList, dispatch ] = useReducer(projectsReducer, projects);

    return (
        <ProjectsContext value={{ projects: projectList, dispatch: dispatch }}>
            {children}
        </ProjectsContext>
    )
}

function projectsReducer(prevProjects: Project[], action: ProjectsAction) {
    if (!prevProjects) {
        return [];
    }
    switch (action.type) {
        case "move": {
            return arrayMove(prevProjects, action.oldIndex, action.newIndex);
        }
        case "edit": {
            return prevProjects.map(project => {
                if (project.id === action.newValues.id) {
                    return { ...project, name: action.newValues.name };
                } else {
                    return project;
                }
            });
        }
        case "delete": {
            return prevProjects.filter(project => project.id !== action.id);
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