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
    SidebarTrigger,
} from "@/components/ui/sidebar"
import useProjects from "../providers/ProjectsProvider"
import { Button } from "../ui/button";
import { Calendar, ChevronRight, Inbox, Plus, Search, Sun, Tag } from "lucide-react";
import { ProjectNode } from "@/lib/definitions";
import { Collapsible } from "../ui/collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";

export function AppSidebar() {
    const { projects } = useProjects();
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

    return (
        <Sidebar className="" collapsible="icon">
            <SidebarHeader>
                <Button>
                    <Plus />
                    Add task
                </Button>
                <Button variant="outline">
                    <Search />
                    Search
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>App</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map(link => (
                                <SidebarMenuItem key={link.href}>
                                    <SidebarMenuButton asChild>
                                        <a href={link.href}>
                                            {link.icon}
                                            <span>{link.title}</span>
                                        </a>
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
                            {projects.map(project => (
                                <Collapsible key={project.id}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a href={`/app/project/${project.id}`}>
                                                <span>{project.name}</span>
                                            </a>
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
                <SidebarTrigger />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )

    function mapSubProjects(projects: ProjectNode[]) {
        if (projects && projects.length > 0) {
            return projects.map((project) => (
                <Collapsible key={project.id}>
                    <SidebarMenuSubItem
                    // onClick={() => {
                    //     setTitle(project.name);
                    // }}
                    >
                        <SidebarMenuSubButton asChild>
                            <a href={`/app/project/${project.id}`}>
                                <span>{project.name}</span>
                            </a>
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