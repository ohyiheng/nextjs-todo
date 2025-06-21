"use client";

import clsx from "clsx"
import Link from "next/link"
import Button, { btnStyles } from "@/components/button"
import {
    MoreVert,
    NavArrowRight,
    Search,
    Box,
    Calendar,
    Hashtag,
    Plus,
    SidebarExpand,
    SunLight
} from "iconoir-react"
import { useState } from "react"
import React from "react";
import { ProjectNode } from "@/lib/definitions";

export default function AppSidebar({
    projects,
    children
}: Readonly<{
    projects: ProjectNode[]
    children: React.ReactNode
}>) {
    const [ opened, setOpened ] = useState(true);

    function mapProjectElements(projects: ProjectNode[]) {
        return projects.map((project) => (
            <SidebarLink
                href={"/app/project/" + project.id}
                title={project.name}
                key={project.id}
            >
                {
                    project.subProject &&
                    project.subProject.length > 0 &&
                    mapProjectElements(project.subProject)
                }
            </SidebarLink>
        ))
    }

    return (
        <div className="flex min-h-screen">
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
                    <SidebarLink href="/app" title="Inbox" icon={<Box />} />
                    <SidebarLink href="/app/today" title="Today" icon={<SunLight />} />
                    <SidebarLink href="/app/upcoming" title="Upcoming" icon={<Calendar />} />
                    <SidebarLink href="/app/tags" title="Tags" icon={<Hashtag />} />
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
            <main className="grow bg-white dark:bg-neutral-950">
                <Button width="icon" onClick={() => {setOpened(!opened)}}>
                    <SidebarExpand />
                </Button>
                {children}
            </main>
        </div>
    )
}

export function Sidebar({
    children,
    opened,
}: Readonly<{
    children: React.ReactNode,
    opened: boolean,
}>) {
    return (
        <div className={`
            ${!opened && "-ml-(--sidebar-width)"}
            w-(--sidebar-width) min-h-screen max-h-screen
            p-3 space-y-4
            bg-neutral-100 dark:bg-neutral-900
            border-r border-r-neutral-200 dark:border-r-neutral-700
            duration-200 ease-out
        `}>
            {children}
        </div>
    )
}

export function SidebarLink({
    href,
    title,
    icon,
    children
}: Readonly<{
    href: string,
    title: string,
    icon?: any,
    children?: React.ReactNode
}>) {

    const [ expanded, setExpanded ] = useState(false);
    const [ hovered, setHovered ] = useState(false);

    return (
        <>
            <Link
                href={href}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={clsx(
                    btnStyles.base,
                    btnStyles.layout.full,
                    btnStyles.color.transparent,
                    "w-full block"
                )}>
                <div title={title} className={"flex items-center gap-1.5"}>
                    {icon}
                    <p className="grow truncate">{title}</p>
                    {hovered &&
                        <button
                            className={clsx(
                                btnStyles.base,
                                btnStyles.color.transparent,
                                btnStyles.layout.icon,
                                "-my-1.5"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                            }}>
                            <MoreVert />
                        </button>
                    }
                    {children &&
                        <button
                            className={clsx(
                                btnStyles.base,
                                btnStyles.color.transparent,
                                btnStyles.layout.icon,
                                "-my-1.5",
                                expanded && "rotate-90"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                setExpanded(!expanded);
                            }}>
                            <NavArrowRight />
                        </button>
                    }
                </div>
            </Link>

            {expanded && children &&
                <div className="pl-4">
                    {children}
                </div>
            }
        </>
    )
}

export function SidebarSearch() {
    return (
        <button className={clsx(
            btnStyles.base,
            btnStyles.layout.full,
            btnStyles.color.white,
            "rounded-full"
        )}>
            <div className="flex items-center justify-center gap-2">
                <Search />
                Search
            </div>
        </button>
    )
}
