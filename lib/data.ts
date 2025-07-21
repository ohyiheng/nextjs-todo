import { TasksDispatchContext } from "@/components/providers/TasksContext";
import { Project, ProjectNode, Task } from "@/lib/definitions";

import postgres from "postgres";

const sql = postgres(
    "postgres://postgres:example@localhost:5432/postgres",
    {
        idle_timeout: 10,
        transform: {
            ...postgres.camel,
            undefined: null
        },
        max: 10
    },
);
/**
 * Fetches all projects from the database and constructs a hierarchical tree structure
 * of projects and their sub-projects up to a maximum depth of 5 levels.
 *
 * Each project node may contain a `subProject` property, which is an array of its direct sub-projects,
 * or `null` if there are no sub-projects or the maximum depth is reached.
 *
 * @returns {Promise<ProjectNode[]>} A promise that resolves to an array of root project nodes,
 * each with their nested sub-projects.
 */
export async function fetchProjects() {
    const projectNodes = await sql<Project[]>`
        SELECT ${sql("id", "name", "createdAt", "lastModifiedAt", "sortBy", "sortOrder")}
        FROM projects
    `
    return projectNodes;
}

export async function fetchProjectsById(id: string) {
    const projectNodes = await sql<Project[]>`
        SELECT ${sql("id", "name", "createdAt", "lastModifiedAt")} FROM projects WHERE id = ${id}
    `
    return projectNodes[ 0 ];
}

export async function fetchTasks(projectId?: number) {
    let tasks: Task[];
    if (projectId) {
        tasks = await sql<Task[]>`
        SELECT ${sql(
            "id",
            "name",
            "createdAt",
            "lastModifiedAt",
            "priority",
            "description",
            "parentId",
            "projectId",
            "startDate",
            "dueDate",
            "completed"
        )} FROM tasks WHERE project_id = ${projectId}`
    } else {
        tasks = await sql<Task[]>`
        SELECT ${sql(
            "id",
            "name",
            "createdAt",
            "lastModifiedAt",
            "priority",
            "description",
            "parentId",
            "projectId",
            "startDate",
            "dueDate",
            "completed"
        )} FROM tasks`
    }

    const tasksTags = await fetchTasksTags();
    for (let i = 0; i < tasks.length; i++) {
        const tags = tasksTags
            .filter(taskTag => taskTag.taskId === tasks[i].id)
            .map(taskTag => taskTag.tagId);
        tasks[i].tags = tags;
    }

    return tasks;
}

export async function fetchTags() {
    const tags: { id: string }[] = await sql<{ id: string }[]>`
        SELECT ${sql(
        "id"
    )} FROM tags
    `
    return tags.map(tag => tag.id);
}

export async function fetchTasksTags() {
    const tasksTags = await sql<{ taskId: string, tagId: string }[]>`
            SELECT ${sql("taskId", "tagId")}
            FROM tasks_tags
        `
    return tasksTags;
}