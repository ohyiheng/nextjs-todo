import { TasksDispatchContext } from "@/components/providers/TasksContext";
import { Project, Task } from "@/lib/definitions";

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
 * @returns {Promise<Project[]>} A promise that resolves to an array of root project nodes,
 * each with their nested sub-projects.
 */
export async function fetchProjects(username: string) {
    const projects = await sql<Project[]>`
        SELECT ${sql("id", "name", "createdAt", "lastModifiedAt", "sortBy", "sortOrder", "isInbox")}
        FROM projects
        WHERE owner = ${username}
    `
    return projects;
}

export async function fetchTasks(username: string) {
    const tasks = await sql<Task[]>`
        SELECT ${sql(
        "tasks.id",
        "tasks.name",
        "tasks.createdAt",
        "tasks.lastModifiedAt",
        "tasks.priority",
        "tasks.description",
        "tasks.parentId",
        "tasks.projectId",
        "tasks.startDate",
        "tasks.dueDate",
        "tasks.completed"
    )} FROM tasks JOIN projects ON (tasks.project_id = projects.id) WHERE projects.owner = ${username}
    `

    const tasksTags = await fetchTasksTags(username);
    for (let i = 0; i < tasks.length; i++) {
        const tags = tasksTags
            .filter(taskTag => taskTag.taskId === tasks[ i ].id)
            .map(taskTag => taskTag.tagId);
        tasks[ i ].tags = tags;
    }

    // maps descriptions from null to undefined
    return tasks.map(task => ({
        ...task,
        description: task.description === null ? undefined : task.description
    }));
}

export async function fetchTags(username: string) {
    const tags: { id: string }[] = await sql<{ id: string }[]>`
        SELECT id FROM tags WHERE owner = ${username}
    `
    return tags.map(tag => tag.id);
}

export async function fetchTasksTags(username: string) {
    const tasksTags = await sql<{ taskId: string, tagId: string }[]>`
        SELECT ${sql("taskId", "tagId")}
        FROM tasks_tags
        WHERE tag_owner = ${username}
    `
    return tasksTags;
}