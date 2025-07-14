import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ProjectNode, TaskNode } from "./definitions";

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

export function getProjectNameFromId(projects: ProjectNode[], id: number) {
    if (id === 1) {
        return "Inbox";
    }
    let projectName = projects.find(project => project.id === id)?.name;
    if (projectName) return projectName;

    for (let i = 0; i < projects.length; i++) {
        if (projects[i].subProjects && projects[i].subProjects!.length > 0) {
            projectName = getProjectNameFromId(projects[i].subProjects!, id);
            if (projectName) break;
        }
    }
    return projectName;
}

export function getTaskNodeById(tasks: TaskNode[], id: string): TaskNode | undefined {
    let result = tasks.find(task => task.id === id);
    if (result) return result;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].subTasks && tasks[i].subTasks!.length > 0) {
            result = getTaskNodeById(tasks, id);
            if (result) break;
        }
    }
    return result;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}