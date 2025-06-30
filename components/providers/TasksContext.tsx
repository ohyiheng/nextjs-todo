"use client";

import { TaskNode } from "@/lib/definitions";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, Dispatch, useReducer } from "react";

type TasksAction = {
    type: "move",
    oldIndex: number,
    newIndex: number
}

export const TasksContext = createContext<TaskNode[] | null>(null);
export const TasksDispatchContext = createContext<Dispatch<TasksAction>>(() => {});

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
    }
}
