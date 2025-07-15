"use client";

import { TaskNode } from "@/lib/definitions";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, useReducer } from "react";
import { TaskFormType } from "../app/task-form";
import { getTaskById } from "../app/task";

type TasksAction = {
    type: "move",
    oldIndex: number,
    newIndex: number
} | {
    type: "edit",
    newValues: TaskFormType
}

export const TasksContext = createContext<TaskNode[] | null>(null);
export const TasksDispatchContext = createContext<Dispatch<TasksAction>>(() => { });

export default function TasksProvider({
    tasks,
    children
}: {
    tasks: TaskNode[],
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

function tasksReducer(prevTasks: TaskNode[] | null, action: TasksAction) {
    if (!prevTasks) {
        return null;
    }
    switch (action.type) {
        case "move": {
            return arrayMove(prevTasks, action.oldIndex, action.newIndex);
        }
        case "edit": {
            let task = getTaskById(prevTasks, action.newValues.id);
            console.log(action.newValues);
            task!.name = action.newValues.name;
            task!.description = action.newValues.description;
            task!.priority = action.newValues.priority;
            task!.projectId = action.newValues.projectId;
            task!.startDate = action.newValues.startDate;
            task!.dueDate = action.newValues.dueDate;
            return prevTasks;
        }
    }
}
