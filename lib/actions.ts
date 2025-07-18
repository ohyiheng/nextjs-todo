"use server";

import { TaskFormType } from "./definitions";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { SortByType } from "./definitions";

const sql = postgres(
    "postgres://postgres:example@localhost:5432/postgres",
    {
        idle_timeout: 10,
        transform: {
            ...postgres.camel,
            undefined: null
        },
        max: 100
    },
);

export async function addTask(task: TaskFormType) {
    try {
        await sql`INSERT INTO tasks (
            id,
            name,
            priority,
            description,
            start_date,
            due_date,
            project_id
        ) VALUES (
            ${task.id},
            ${task.name},
            ${task.priority},
            ${task.description ?? null},
            ${task.startDate},
            ${task.dueDate},
            ${task.projectId}
         )`;
    } catch (error) {
        console.error(error);
    }
    revalidatePath("/app/inbox");
    revalidatePath("/app/project/[id]", "page");
}

export async function updateTask(task: TaskFormType) {
    try {
        await sql`UPDATE tasks SET
            name = ${task.name},
            description = ${task.description ?? null},
            priority = ${task.priority},
            project_id = ${task.projectId},
            start_date = ${task.startDate},
            due_date = ${task.dueDate}
            WHERE id = ${task.id}`;
    } catch (error) {
        console.error(error);
    }
    revalidatePath("/app/inbox");
    revalidatePath("/app/project/[id]", "page");
}

export async function completeTask(id: string, completed: boolean) {
    try {
        await sql`UPDATE tasks SET
            completed = ${!completed}
            WHERE id = ${id}
        `
    } catch (error) {
        console.error(error);
    }

    revalidatePath("/app/inbox");
    revalidatePath("/app/project/[id]", "page");
}

export async function updateProjectSort(id: number, sortBy?: SortByType, sortOrder?: "asc" | "desc") {
    try {
        if (sortBy) {
            await sql`UPDATE projects
                SET sort_by = ${sortBy}
                WHERE id = ${id}`
        }
        if (sortOrder) {
            await sql`UPDATE projects
            SET sort_order = ${sortOrder}
            WHERE id = ${id}`
        }
    } catch (error) {
        console.error(error);
    }
}