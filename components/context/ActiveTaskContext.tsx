import { TaskNode } from "@/lib/definitions";
import { createContext, Dispatch, useContext, useState } from "react";

type ActiveTaskContextType = {
    activeTask: TaskNode | null,
    setActiveTask: Dispatch<TaskNode | null>
}

const ActiveTaskContext = createContext<ActiveTaskContextType | undefined>(undefined);

export function ActiveTaskProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [ activeTask, setActiveTask ] = useState<TaskNode | null>(null);

    return (
        <ActiveTaskContext value={{ activeTask, setActiveTask }}>
            {children}
        </ActiveTaskContext>
    )
}

export default function useActiveTask() {
    const activeTaskContext = useContext(ActiveTaskContext);
    if (!activeTaskContext) {
        throw new Error("useActiveTask should be used within an ActiveTaskProvider");
    }
    return activeTaskContext;
}