import z from "zod/v4";

export type Task = {
    id: string,
    name: string,
    description?: string,
    createdAt: Date,
    lastModifiedAt: Date,
    priority: '0' | '1' | '2' | '3',
    completed: boolean,
    projectId: number,
    startDate: Date | null,
    dueDate: Date | null,
    parentId?: string,
}

export type SortByType = "priority" | "start" | "due" | "name";

export type Project = {
    id: number,
    name: string,
    createdAt: Date,
    lastModifiedAt: Date,
    sortBy: SortByType,
    sortOrder: "asc" | "desc",
    parentId?: number,
}

export type ProjectNode = Project & {
    subProjects: ProjectNode[] | null
}

export const TaskFormSchema = z.object({
    id: z.uuid(),
    name: z.string("Task needs a name!").check(z.minLength(1, "Task needs a name!")),
    priority: z.literal([ '0', '1', '2', '3' ]),
    description: z.string().optional(),
    startDate: z.date().nullable(),
    dueDate: z.date().nullable(),
    projectId: z.number(),
    createdAt: z.date(),
    lastModifiedAt: z.date(),
    completed: z.boolean()
})

export type TaskFormType = z.infer<typeof TaskFormSchema>;

export const ProjectFormSchema = z.object({
    id: z.number(),
    name: z.string("Project needs a name!").check(z.minLength(1, "Project needs a name!")),
})

export type ProjectFormType = z.infer<typeof ProjectFormSchema>;