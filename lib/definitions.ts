export type Task = {
    id: string,
    name: string,
    description?: string,
    createdAt: Date,
    lastModifiedAt: Date,
    priority: number,
    level: number,
    completed: boolean,
    startDate?: Date,
    dueDate?: Date,
    parentTaskId?: string,
    projectId?: string,
}

export type Project = {
    id: string,
    name: string,
    createdAt: Date,
    lastModifiedAt: Date,
    level: number,
    parentProjectId?: string,
}

export type ProjectNode = Project & {
    subProjects: ProjectNode[] | null
}
