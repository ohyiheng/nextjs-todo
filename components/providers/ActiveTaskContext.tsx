"use client";

import { Task } from "@/lib/definitions";
import { createContext, Dispatch, useContext, useState } from "react";

type ActiveTaskContextType = {
    activeTask: Task | null,
    setActiveTask: Dispatch<Task | null>
}

const ActiveTaskContext = createContext<ActiveTaskContextType | undefined>(undefined);

export function ActiveTaskProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [ activeTask, setActiveTask ] = useState<Task | null>(null);

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