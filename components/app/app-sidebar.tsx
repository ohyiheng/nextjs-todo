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
} from "@/components/ui/sidebar"
import useProjects from "../providers/ProjectsProvider"
import { Calendar, ChevronRight, Inbox, Plus, Search, Sun, Tag } from "lucide-react";
import { ProjectNode } from "@/lib/definitions";
import { Collapsible } from "../ui/collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import Link from "next/link";

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
                                <Collapsible key={project.id}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href={`/app/project/${project.id}`}>
                                                <span>{project.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {
                                            project.subProjects &&
                                            project.subProjects.length > 0 &&
                                            <>
                                                <SidebarMenuAction>
                                                    <CollapsibleTrigger asChild>
                                                        <ChevronRight className="data-[state=open]:rotate-90 duration-75 ease-in-out cursor-pointer" />
                                                    </CollapsibleTrigger>
                                                </SidebarMenuAction>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {mapSubProjects(project.subProjects)}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </>
                                        }

                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )

    function mapSubProjects(projects: ProjectNode[]) {
        if (projects && projects.length > 0) {
            return projects.map((project) => (
                <Collapsible key={project.id}>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                            <Link href={`/app/project/${project.id}`}>
                                <span>{project.name}</span>
                            </Link>
                        </SidebarMenuSubButton>
                        {
                            project.subProjects &&
                            project.subProjects.length > 0 &&
                            <>
                                <SidebarMenuAction>
                                    <CollapsibleTrigger asChild>
                                        <ChevronRight className={`data-[state=open]:rotate-90 duration-75 ease-in-out cursor-pointer`} />
                                    </CollapsibleTrigger>
                                </SidebarMenuAction>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {mapSubProjects(project.subProjects)}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </>
                        }
                    </SidebarMenuSubItem>
                </Collapsible>
            ))
        }
        return null;
    }
}