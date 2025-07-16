import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ProjectNode, TaskNode } from "./definitions";
import { DateTime } from "luxon";

export async function hashSecret(secret: string): Promise<Uint8Array> {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return new Uint8Array(secretHashBuffer);
}

export function compareHashConstantTime(a: Uint8Array, b: Uint8Array) {
    if (a.length != b.length) {
        return false;
    }
    let c = 0;
    for (let i = 0; i < a.length; i++) {
        c |= a[ i ] ^ b[ i ];
    }
    return c === 0;
}

export function partition<T>(array: T[], predicate: (x: T) => boolean) {
    let [ pass, fail ]: [ T[], T[] ] = [ Array(), Array() ];
    for (let item of array) {
        if (predicate(item)) {
            pass.push(item);
        } else {
            fail.push(item);
        }
    }
    return [ pass, fail ];
}

export function getProjectFromId(projects: ProjectNode[], id: number): ProjectNode | null {
    let project = projects.find(project => project.id === id) ?? null;
    if (project) return project;

    for (let i = 0; i < projects.length; i++) {
        if (projects[ i ].subProjects && projects[ i ].subProjects!.length > 0) {
            project = getProjectFromId(projects[ i ].subProjects!, id);
            if (project) break;
        }
    }
    return project;
}

export function getTaskNodeById(tasks: TaskNode[], id: string): TaskNode | undefined {
    let result = tasks.find(task => task.id === id);
    if (result) return result;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[ i ].subTasks && tasks[ i ].subTasks!.length > 0) {
            result = getTaskNodeById(tasks, id);
            if (result) break;
        }
    }
    return result;
}

export function computeStartDateColor(task: TaskNode) {
    if (!task.startDate) return "";

    const diffInDays = DateTime.fromJSDate(task.startDate).startOf('day').diff(DateTime.now().startOf('day'), 'days').days;

    if (diffInDays < 0) return "text-red-600 dark:text-red-400";
    if (diffInDays < 7) return "text-green-700 dark:text-green-400";
    return "text-zinc-700 dark:text-zinc-400";
}

export function computeDueDateColor(task: TaskNode) {
    if (!task.dueDate) return "";

    const diffInDays = DateTime.fromJSDate(task.dueDate).diff(DateTime.now(), 'days').as('days');

    if (diffInDays < 0) return "text-red-600 dark:text-red-400";
    if (diffInDays < 7) return "text-orange-700 dark:text-orange-400"
    return "text-zinc-700 dark:text-zinc-400"
}

export function taskInFuture(task: TaskNode): boolean {
    if (!task.startDate) return false;
    const diffInDays = DateTime.fromJSDate(task.startDate).diff(DateTime.now(), 'days').as('days');
    return diffInDays > 0 ? true : false;
}

export function getTaskSortingPredicate(project?: ProjectNode) {
    let sortingPredicate: (a: TaskNode, b: TaskNode) => number;
    switch (project?.sortBy) {
        case "start": {
            sortingPredicate = (a, b) => {
                return project.sortOrder === "asc"
                    ? (a.startDate?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.startDate?.getTime() ?? Number.MAX_SAFE_INTEGER)
                    : (b.startDate?.getTime() ?? 0) - (a.startDate?.getTime() ?? 0)
            }
            break;
        }
        case "due": {
            sortingPredicate = (a, b) => {
                return project.sortOrder === "asc"
                    ? (a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER)
                    : (b.dueDate?.getTime() ?? 0) - (a.dueDate?.getTime() ?? 0)
            }
            break;
        }
        case "name": {
            sortingPredicate = (a, b) => {
                return project.sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            }
            break;
        }
        default: {
            sortingPredicate = (a, b) => {
                return project?.sortOrder === "asc"
                    ? parseInt(a.priority) - parseInt(b.priority)
                    : parseInt(b.priority) - parseInt(a.priority)
            };
            break;
        }
    }
    return sortingPredicate;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}