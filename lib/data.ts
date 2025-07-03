import { ProjectNode, TaskNode } from "@/lib/definitions";
import { partition } from "@/lib/utils";

import postgres from "postgres";

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
    const projectNodes = await sql<ProjectNode[]>`
        SELECT ${sql("id", "name", "createdAt", "lastModifiedAt", "level", "parentId")} FROM projects
    `

    // keep root projects only
    const [ rootProjects, remainingProjects ] = partition(projectNodes, project => project.parentId == null)

    // for each root project, find its subprojects
    for (let i = 0; i < rootProjects.length; i++) {
        rootProjects[ i ].subProjects = findSubProjects(remainingProjects, rootProjects[ i ].id, 1, 3);
    }

    sortTree(rootProjects);
    return rootProjects;
}

export async function fetchProjectsById(id: string) {
    const projectNodes = await sql<ProjectNode[]>`
        SELECT ${sql("id", "name", "createdAt", "lastModifiedAt", "level", "parentId")} FROM projects WHERE id = ${id}
    `
    return projectNodes[ 0 ];
}

export async function fetchTasks(projectId?: string) {
    let taskNodes;
    if (projectId) {
        taskNodes = await sql<TaskNode[]>`
        SELECT ${sql(
            "id",
            "name",
            "createdAt",
            "lastModifiedAt",
            "priority",
            "level",
            "description",
            "parentId",
            "projectId",
            "startDate",
            "dueDate",
            "completed"
        )} FROM tasks WHERE project_id = ${projectId}`
    } else {
        taskNodes = await sql<TaskNode[]>`
        SELECT ${sql(
            "id",
            "name",
            "createdAt",
            "lastModifiedAt",
            "priority",
            "level",
            "description",
            "parentId",
            "projectId",
            "startDate",
            "dueDate",
            "completed"
        )} FROM tasks`
    }

    // keep root tasks only
    const [ rootTasks, remainingTasks ] = partition(taskNodes, task => task.parentId == null)

    // for each root task, find its subtasks
    for (let i = 0; i < rootTasks.length; i++) {
        rootTasks[ i ].subTasks = findSubTasks(remainingTasks, rootTasks[ i ].id, 1, 3);
    }

    sortTree(rootTasks);
    return rootTasks;
}

function findSubProjects(
    projectNodes: ProjectNode[],
    projectId: string,
    level: number,
    maxLevel: number
) {
    if (level === maxLevel) {
        return null;
    }

    // filter matching subProjects
    let [ subProjects, remainingProjects ] = partition(projectNodes, project => project.parentId === projectId);
    if (!subProjects || subProjects.length === 0) {
        return null;
    }

    // recursively find subProjects of each subProject
    subProjects.forEach(subProject => {
        subProject.subProjects = findSubProjects(remainingProjects, subProject.id, level + 1, maxLevel);
    })
    return subProjects;
}

function findSubTasks(
    taskNodes: TaskNode[],
    taskId: string,
    level: number,
    maxLevel: number
) {
    if (level === maxLevel) {
        return null;
    }

    // filter matching subProjects
    let [ subTasks, remainingTasks ] = partition(taskNodes, task => task.parentId === taskId);
    if (!subTasks || subTasks.length === 0) {
        return null;
    }

    // recursively find subProjects of each subProject
    subTasks = subTasks.map((subTask) => {
        subTask.subTasks = findSubTasks(remainingTasks, subTask.id, level + 1, maxLevel);
        return subTask;
    })
    return subTasks;
}


// Sort project/task tree by name
function sortTree(tree: ProjectNode[] | TaskNode[] | null) {
    if (!tree) {
        return;
    }
    tree.sort((a, b) => a.name.localeCompare(b.name));
    for (let node of tree) {
        if ("subProjects" in node) {
            sortTree(node.subProjects);
        } else if ("subTasks" in node) {
            sortTree(node.subTasks);
        }
    }
}
