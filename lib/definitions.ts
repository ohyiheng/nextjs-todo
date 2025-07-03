export type Task = {
    id: string,
    name: string,
    description?: string,
    createdAt: Date,
    lastModifiedAt: Date,
    priority: '0' | '1' | '2' | '3',
    level: number,
    completed: boolean,
    projectId: string | null,
    startDate: Date | null,
    dueDate: Date | null,
    parentId?: string,
}

export type TaskNode = Task & {
    subTasks: TaskNode[] | null
}

export type Project = {
    id: string,
    name: string,
    createdAt: Date,
    lastModifiedAt: Date,
    level: number,
    parentId?: string,
}

export type ProjectNode = Project & {
    subProjects: ProjectNode[] | null
}