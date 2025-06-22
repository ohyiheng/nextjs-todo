"use client";

import clsx from "clsx"
import Link from "next/link"
import { btnStyles } from "@/components/button"
import { useState } from "react"
import React from "react";
import {
    ChevronRight,
    EllipsisVertical,
    Search,
} from "lucide-react";

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
            p-(--outer-padding) space-y-4
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

    return (
        <>
            <Link
                href={href}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={onClick}
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
