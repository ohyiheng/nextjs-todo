"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar"
import useProjects from "../providers/ProjectsProvider"
import { Calendar, Inbox, Plus, Search, SquareGanttChart, Sun, Tag } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useAtom, useSetAtom } from "jotai";
import { activeProjectAtom, addTaskDialogOpenAtom, projectAddOpenAtom } from "@/lib/atoms";
import ProjectDropdown from "./project-dropdown";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export function AppSidebar() {
    const { projects } = useProjects();
    const [activeProject, setActiveProject] = useAtom(activeProjectAtom);
    const setAddTaskDialogOpen = useSetAtom(addTaskDialogOpenAtom);
    const setProjectAddOpen = useSetAtom(projectAddOpenAtom);
    const pathname = usePathname();

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
    const { state, setOpenMobile } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuButton onClick={() => setAddTaskDialogOpen(true)}>
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
                                    <SidebarMenuButton isActive={link.href === pathname} asChild>
                                        <Link href={link.href} onClick={() => setOpenMobile(false)}>
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
                    <SidebarGroupAction onClick={() => setProjectAddOpen(true)}>
                        <Plus className="text-muted-foreground cursor-pointer" />
                        <span className="sr-only">Add Project</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projectsWithoutInbox.map(project => (
                                <SidebarMenuItem key={project.id}>
                                    {state === "collapsed" ?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link className="truncate" href={`/app/project/${project.id}`}>
                                                        <SquareGanttChart />
                                                        <span>{project.name}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>{project.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        :
                                        <>
                                            <SidebarMenuButton isActive={activeProject?.id === project.id} asChild>
                                                <Link
                                                    title={project.name}
                                                    className="truncate"
                                                    href={`/app/project/${project.id}`}
                                                    onClick={() => {
                                                        setOpenMobile(false);
                                                        // setActiveProject(project);
                                                    }}
                                                >
                                                    <SquareGanttChart />
                                                    <span>{project.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            <ProjectDropdown project={project} inSidebar={true} />
                                        </>
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