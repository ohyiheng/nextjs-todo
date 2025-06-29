"use client";

import { ProjectNode } from "@/lib/definitions";
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TaskContainer } from "./task";
import { ProjectContext } from "./context/ProjectContext";
import { ActiveTaskProvider } from "./context/ActiveTaskContext";
import { useTitle } from "./context/TitleContext";
import RightPanel from "./right-panel";
import Header from "./header";


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
                {children}
            </ProjectContext>
        </div>
    )
}

export function App() {
    const { title, setTitle } = useTitle();
    const [ isEditing, setIsEditing ] = useState(false);

    return (
        <ActiveTaskProvider>
            <Sidebar setTitle={setTitle} />
            <main className="grow bg-zinc-50 dark:bg-zinc-950 flex flex-col">
                <Header title={title} />
                <div className="p-4 mx-auto w-full grow">
                    <TaskContainer setIsEditing={setIsEditing} />
                </div>
            </main>
            <RightPanel isEditing={isEditing} setIsEditing={setIsEditing} />
        </ActiveTaskProvider>
    )
}
