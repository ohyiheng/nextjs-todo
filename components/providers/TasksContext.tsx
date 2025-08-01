"use client";

import { Task, TaskFormType } from "@/lib/definitions";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, useReducer } from "react";
import { getTaskById } from "@/lib/utils";

type TasksAction = {
    type: "move",
    oldIndex: number,
    newIndex: number
} | {
    type: "edit" | "add",
    newValues: TaskFormType
} | {
    type: "delete",
    id: string
} | {
    type: "rename-tag",
    oldTag: string,
    newTag: string
}

export const TasksContext = createContext<Task[] | undefined>(undefined);
export const TasksDispatchContext = createContext<Dispatch<TasksAction> | undefined>(undefined);

export default function TasksProvider({
    tasks,
    children
}: {
    tasks: Task[],
    children: React.ReactNode
}) {
    const [ taskList, dispatch ] = useReducer(tasksReducer, tasks);

    return (
        <TasksContext value={taskList}>
            <TasksDispatchContext value={dispatch}>
                {children}
            </TasksDispatchContext>
        </TasksContext>
    )
}

function tasksReducer(prevTasks: Task[] | undefined, action: TasksAction) {
    console.log("dispatching...");
    if (!prevTasks) {
        return undefined;
    }
    switch (action.type) {
        case "move": {
            return arrayMove(prevTasks, action.oldIndex, action.newIndex);
        }
        case "edit": {
            let task = getTaskById(prevTasks, action.newValues.id);
            task!.name = action.newValues.name;
            task!.description = action.newValues.description;
            task!.priority = action.newValues.priority;
            task!.projectId = action.newValues.projectId;
            task!.startDate = action.newValues.startDate;
            task!.dueDate = action.newValues.dueDate;
            task!.tags = action.newValues.tags;
            return prevTasks;
        }
        case "add": {
            // todo: check uuid for duplicates
            const newTasks = [ ...prevTasks, { ...action.newValues } ]
            return newTasks;
        }
        case "delete": {
            return prevTasks.filter(task => task.id !== action.id)
        }
        case "rename-tag": {
            return prevTasks.map(task => ({
                ...task, tags: task.tags?.includes(action.newTag)
                    ? task.tags?.filter(tag => tag !== action.oldTag)
                    : task.tags?.map(tag => {
                        if (tag === action.oldTag) {
                            return action.newTag
                        } else {
                            return tag
                        }
                    })
            }))
        }
    }
}
