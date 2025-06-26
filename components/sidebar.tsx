"use client";

import clsx from "clsx"
import Link from "next/link"
import Button, { btnStyles } from "@/components/button"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import React from "react";
import {
    Calendar,
    ChevronRight,
    EllipsisVertical,
    Inbox,
    PanelLeft,
    Plus,
    Search,
    Sun,
    Tag,
} from "lucide-react";
import { ProjectNode } from "@/lib/definitions";
import { ProjectContext } from "@/components/context/ProjectContext";
import useActiveTask from "./context/ActiveTaskContext";

export function Sidebar({
    setTitle,
}: {
    setTitle: Dispatch<string>
}) {
    const projects = useContext(ProjectContext);
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
    ];

    const [ opened, setOpened ] = useState(true);

    return (
        <div className={`
            ${!opened && "-ml-(--sidebar-width)"}
            w-(--sidebar-width) min-h-screen max-h-screen
            p-(--outer-padding) space-y-4
            bg-neutral-100 dark:bg-neutral-900
            border-r border-r-neutral-200 dark:border-r-neutral-700
            duration-200 ease-out
        `}>
            <div className="flex flex-col justify-between h-full">
                <div className="space-y-4">
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
                                onClick={() => {
                                    setTitle(link.title);
                                }}
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
                </div>
                <div>
                    <div className="p-(--outer-padding) mb-3">
                        rainmrn
                    </div>
                    <div className="flex border-t border-neutral-300 pt-3">
                        <button className={clsx(
                            btnStyles.base,
                            btnStyles.layout.icon,
                            btnStyles.color.transparent
                        )} onClick={() => { setOpened(!opened) }}>
                            <PanelLeft />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    function mapProjectElements(projects: ProjectNode[] | null) {
        if (projects) {
            return projects.map((project) => (
                <SidebarLink
                    href={"/app/project/" + project.id}
                    title={project.name}
                    key={project.id}
                    onClick={() => {
                        setTitle(project.name);
                    }}
                >
                    {
                        project.subProjects &&
                        project.subProjects.length > 0 &&
                        mapProjectElements(project.subProjects)
                    }
                </SidebarLink>
            ))
        }
        return null;
    }
}

export function SidebarLink({
    href,
    title,
    icon,
    children,
    onClick
}: Readonly<{
    href: string,
    title: string,
    icon?: any,
    children?: React.ReactNode,
    onClick?: () => void
}>) {

    const [ expanded, setExpanded ] = useState(false);
    const [ hovered, setHovered ] = useState(false);
    const { setActiveTask } = useActiveTask();

    return (
        <>
            <Link
                href={href}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => {
                    if (onClick) {
                        setTimeout(onClick, 0);
                    }
                    setActiveTask(null);
                }}
                className={clsx(
                    btnStyles.base,
                    btnStyles.layout.full,
                    btnStyles.color.transparent,
                    "w-full block"
                )}>
                <div title={title} className={"flex items-center gap-2"}>
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
                                e.stopPropagation();
                                e.preventDefault();
                            }}>
                            <EllipsisVertical />
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
                                e.stopPropagation();
                                e.preventDefault();
                                setExpanded(!expanded);
                            }}>
                            <ChevronRight />
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
