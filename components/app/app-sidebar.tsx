"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import useProjects from "../providers/ProjectsProvider"
import { Calendar, Hash, Inbox, Plus, Search, Sun, Tag } from "lucide-react";
import { ProjectNode } from "@/lib/definitions";
import { Collapsible } from "../ui/collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AppSidebar() {
    const { projects } = useProjects();
    const links = [
        {
            title: "Inbox",
            href: "/app/inbox",
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

    const projectsWithoutInbox = projects.filter(project => project.id !== 1);
    const { state } = useSidebar();

    return (
        <Sidebar className="" collapsible="icon">
            <SidebarHeader>
                <SidebarMenuButton>
                    <Plus />
                    Add task
                </SidebarMenuButton>
                <SidebarMenuButton>
                    <Search />
                    Search
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Tasks</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map(link => (
                                <SidebarMenuItem key={link.href}>
                                    <SidebarMenuButton asChild>
                                        <Link href={link.href}>
                                            {link.icon}
                                            <span>{link.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projectsWithoutInbox.map(project => (
                                <SidebarMenuItem key={project.id}>
                                    {state === "collapsed" ?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link className="truncate" href={`/app/project/${project.id}`}>
                                                        <Hash />
                                                        <span>{project.name}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>{project.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        :
                                        <SidebarMenuButton asChild>
                                            <Link className="truncate" href={`/app/project/${project.id}`}>
                                                <Hash />
                                                <span>{project.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    }
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    )
}