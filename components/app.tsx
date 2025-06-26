"use client";

import { ProjectNode } from "@/lib/definitions";
import React, { useContext, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { btnStyles } from "@/components/button";
import { X } from "lucide-react";
import { TaskContainer } from "./task";
import clsx from "clsx";
import { ProjectContext } from "./context/ProjectContext";
import { useTitle } from "./context/TitleContext";


export default function AppLayout({
    projects,
    children
}: Readonly<{
    projects: ProjectNode[],
    children: React.ReactNode
}>) {

    return (
        <div className="flex h-screen max-h-screen box-border">
            <ProjectContext value={projects}>
                <ActiveTaskProvider>
                    {children}
                </ActiveTaskProvider>
            </ProjectContext>
        </div>
    )
}

export function App() {
    const { title, setTitle } = useTitle();

    return (
        <>
            <Sidebar setTitle={setTitle} />
            <main className="grow bg-neutral-50 dark:bg-neutral-950 flex flex-col">
                <header className="p-(--outer-padding) w-full flex justify-between items-center">
                    <h1 className="text-2xl">{title}</h1>
                    <div></div>
                </header>
                <div className="p-4 mx-auto w-full grow">
                    <TaskContainer />
                </div>
            </main>
            <div className={clsx(
                !activeTask && "-mr-(--task-details-width)",
                "w-(--task-details-width) h-full p-(--outer-padding)","border-l border-neutral-300 bg-white",
                "duration-200 ease-in-out"
            )}>
                <div className="flex items-center gap-3">
                    <button
                        className={clsx(
                            btnStyles.base,
                            btnStyles.layout.icon,
                            btnStyles.color.transparentWithBorder
                        )}
                        onClick={() => { setActiveTask(null) }}>
                        <X />
                    </button>
                    <h2 className="font-semibold text-lg">{activeTask?.name}</h2>
                </div>
            </div>
        </>
    )
}
