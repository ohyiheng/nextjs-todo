"use client";

import { ProjectNode } from "@/lib/definitions";
import { useState } from "react";
import { Sidebar, SidebarLink, SidebarSearch } from "@/components/sidebar";
import Button from "@/components/button";
import { Calendar, Inbox, PanelLeft, Plus, Sun, Tag } from "lucide-react";

const links = [
    {
        title: "Inbox",
        href: "/app",
        icon: <Inbox />
    },
    {
        title: "Today",
        href: "/app/today",
        icon: <Sun />
    },
    {
        title: "Upcoming",
        href: "/app/upcoming",
        icon: <Calendar />
    },
    {
        title: "Tags",
        href: "/app/tags",
        icon: <Tag />
    },
]

export default function AppLayout({
    projects,
    children,
    itemDetail,
}: Readonly<{
    projects: ProjectNode[],
    children: React.ReactNode,
    itemDetail?: React.ReactNode,
}>) {
    const [ opened, setOpened ] = useState(true);
    const [ title, setTitle ] = useState("Inbox");

    function mapProjectElements(projects: ProjectNode[]) {
        return projects.map((project) => (
            <SidebarLink
                href={"/app/project/" + project.id}
                title={project.name}
                key={project.id}
                onClick={() => { setTitle(project.name) }}
            >
                {
                    project.subProjects &&
                    project.subProjects.length > 0 &&
                    mapProjectElements(project.subProjects)
                }
            </SidebarLink>
        ))
    }

    return (
        <div className="flex h-screen max-h-screen box-border">
            <Sidebar opened={opened}>
                <div className="space-y-2">
                    <Button width="full" color="primary">
                        <div className="flex gap-1 items-center justify-center">
                            <Plus />
                            Add task
                        </div>
                    </Button>
                    <SidebarSearch />
                </div>
                <nav id="main-nav">
                    {links.map((link) => (
                        <SidebarLink
                            key={link.title}
                            href={link.href}
                            title={link.title}
                            icon={link.icon}
                            onClick={() => { setTitle(link.title) }}
                        />
                    ))}
                </nav>
                <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium px-3 py-1.5">
                        Projects
                    </p>
                    <nav id="project-nav">
                        {mapProjectElements(projects)}
                    </nav>
                </div>
            </Sidebar>
            <div className="grow bg-neutral-50 dark:bg-neutral-950 flex flex-col">
                <header className="p-(--outer-padding) w-full flex justify-between items-center">
                    <Button width="icon" onClick={() => { setOpened(!opened) }}>
                        <PanelLeft />
                    </Button>
                    <h1 className="text-lg">{title}</h1>
                    <div></div>
                </header>
                <main className="p-6 mx-auto w-[700px] max-w-[700px] grow">
                    {children}
                </main>
            </div>
            {itemDetail}
        </div>
    )
}