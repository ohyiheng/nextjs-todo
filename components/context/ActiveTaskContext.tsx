import { TaskNode } from "@/lib/definitions";
import { createContext, Dispatch, useState } from "react";

export const ActiveTaskContext = createContext<TaskNode | null>(null);
export const ActiveTaskDispatchContext = createContext<Dispatch<TaskNode | null>>(() => {});

export default function ActiveTaskProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [ activeTask, setActiveTask ] = useState<TaskNode | null>(null);

    function setActiveTaskOrNull(t: TaskNode | null) {
        setActiveTask(t);
    }

    return (
        <ActiveTaskContext value={activeTask}>
            <ActiveTaskDispatchContext value={setActiveTaskOrNull}>
                {children}
            </ActiveTaskDispatchContext>
        </ActiveTaskContext>
    )
}