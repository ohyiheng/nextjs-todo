"use server";

import { ProjectFormType, TaskFormType } from "./definitions";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { SortByType } from "./definitions";

const sql = postgres(
    "postgres://postgres:example@postgres:5432/postgres",
    {
        idle_timeout: 10,
        transform: {
            ...postgres.camel,
            undefined: null
        },
        max: 100
    },
);

export async function addTask(task: TaskFormType, username: string) {
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

        task.tags.forEach(async (tag) => {
            await sql`INSERT INTO tasks_tags VALUES (${task.id}, ${tag}, ${username})`
        });
    } catch (error) {
        console.error(error);
    }
    revalidatePath("/app/inbox");
    revalidatePath("/app/project/[id]", "page");
}

export async function updateTask(task: TaskFormType, username: string) {
    try {
        await sql`UPDATE tasks SET
            name = ${task.name},
            description = ${task.description ?? null},
            priority = ${task.priority},
            project_id = ${task.projectId},
            start_date = ${task.startDate},
            due_date = ${task.dueDate}
            WHERE id = ${task.id}`;

        await sql`DELETE FROM tasks_tags WHERE task_id = ${task.id}`;
        for (let i = 0; i < task.tags.length; i++) {
            await sql`INSERT INTO tasks_tags VALUES (${task.id}, ${task.tags[ i ]}, ${username})`;
        }
    } catch (error) {
        console.error(error);
    }
    revalidatePath("/app/inbox");
    revalidatePath("/app/project/[id]", "page");
}

export async function deleteTask(id: string) {
    try {
        await sql`DELETE FROM tasks WHERE id = ${id}`
    } catch (error) {
        console.error(error)
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

export async function getNextProjectId() {
    const queryResult = await sql<{ newId: string }[]>`SELECT nextval(pg_get_serial_sequence('projects', 'id')) as new_id`
    const id: string = queryResult[ 0 ].newId;
    return parseInt(id);
}

export async function addProject(project: ProjectFormType, username: string) {
    try {
        await sql`INSERT INTO projects (id, name, owner)
            VALUES (${project.id}, ${project.name}, ${username})`;
    } catch (error) {
        console.error(error);
    }
    revalidatePath(`/app/project/${project.id}`);
}

export async function updateProject(project: ProjectFormType) {
    try {
        await sql`UPDATE projects SET
            name = ${project.name},
            last_modified_at = NOW()
            WHERE id = ${project.id}`;
    } catch (error) {
        console.error(error);
    }
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

export async function deleteProject(id: number) {
    try {
        await sql`DELETE FROM projects WHERE id = ${id}`
    } catch (error) {
        console.error(error)
    }
}

export async function addTag(tag: string, username: string) {
    try {
        await sql`INSERT INTO tags
            VALUES (${tag}, ${username})`;
    } catch (error) {
        console.error(error);
    }
    revalidatePath(`/app/tag/${tag}`);
}

export async function editTag(oldTag: string, newTag: string, username: string, tagAlreadyExists: boolean) {
    try {
        await sql.begin(async () => {
            if (!tagAlreadyExists) {
                await addTag(newTag, username);
            }
            await sql`UPDATE tasks_tags
                SET tag_id = ${newTag}
                WHERE task_id NOT IN (SELECT task_id FROM tasks_tags WHERE tag_id = ${newTag})
                AND tag_id = ${oldTag}
                AND tag_owner = ${username}`;
            await sql`DELETE FROM tasks_tags WHERE tag_id = ${oldTag} AND tag_owner = ${username}`;
            await deleteTag(oldTag, username);
        })
    } catch (error) {
        console.error(error);
    }
    revalidatePath(`/app/tag/${newTag}`);
}

export async function deleteTag(id: string, username: string) {
    try {
        await sql`DELETE FROM tags WHERE id = ${id} AND owner = ${username}`;
    } catch (error) {
        console.error(error)
    }
}