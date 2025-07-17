import z from "zod/v4";

export type Task = {
    id: string,
    name: string,
    description?: string,
    createdAt: Date,
    lastModifiedAt: Date,
    priority: '0' | '1' | '2' | '3',
    level: number,
    completed: boolean,
    projectId: number,
    startDate: Date | null,
    dueDate: Date | null,
    parentId?: string,
}

export type TaskNode = Task & {
    subTasks: TaskNode[] | null
}

export type SortByType = "priority" | "start" | "due" | "name";

export type Project = {
    id: number,
    name: string,
    createdAt: Date,
    lastModifiedAt: Date,
    level: number,
    sortBy: SortByType,
    sortOrder: "asc" | "desc",
    parentId?: number,
}

export type ProjectNode = Project & {
    subProjects: ProjectNode[] | null
}

export const TaskFormSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    priority: z.literal([ '0', '1', '2', '3' ]),
    description: z.string(),
    startDate: z.date().nullable(),
    dueDate: z.date().nullable(),
    projectId: z.number(),
})

export type TaskFormType = z.infer<typeof TaskFormSchema>;