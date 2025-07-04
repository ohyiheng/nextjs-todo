"use client";

import { TaskNode } from "@/lib/definitions";
import { createContext, Dispatch, useContext, useState } from "react";

type SortingParameter = {
    by: "priority" | "dueDate" | "name",
    order: "asc" | "desc"
}

type SortingContextType = {
    sort: SortingParameter,
    setSort: Dispatch<SortingParameter>;
}

export const sortTasksBy = {
    priority: {
        asc: (a: TaskNode, b: TaskNode) => {
            return parseInt(a.priority) - parseInt(b.priority);
        },
        desc: (a: TaskNode, b: TaskNode) => {
            return parseInt(b.priority) - parseInt(a.priority);
        }
    }
}

const SortingContext = createContext<SortingContextType | undefined>(undefined);

export function SortingProvider({ children }: { children: React.ReactNode }) {
    const [ sort, setSort ] = useState<SortingParameter>({
        by: "priority",
        order: "desc"
    });

    return (
        <SortingContext.Provider value={{ sort, setSort }}>
            {children}
        </SortingContext.Provider>
    )
}

export default function useSorting() {
    const context = useContext(SortingContext);
    if (!context) {
        throw new Error("useSorting() must be used within a SortingProvider.")
    }
    return context;
}