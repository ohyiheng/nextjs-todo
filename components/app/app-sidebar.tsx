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
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import useProjects from "../providers/ProjectsProvider"
import { Calendar, Ellipsis, Hash, Inbox, Plus, SquareGanttChart, Sun, Tag } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { activeProjectAtom, activeTagAtom, addTaskDialogOpenAtom, projectAddOpenAtom } from "@/lib/atoms";
import ProjectDropdown from "./project/project-dropdown";
import { usePathname } from "next/navigation";
import useTags from "../providers/TagsProvider";
import TagAdd from "./tag/tag-add";
import TagDropdown from "./tag/tag-dropdown";

export function AppSidebar() {
    const { projects } = useProjects();
    const { tags } = useTags();
    const activeProject = useAtomValue(activeProjectAtom);
    const activeTag = useAtomValue(activeTagAtom);
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
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarGroupAction onClick={() => setProjectAddOpen(true)}>
                                <Plus className="text-muted-foreground cursor-pointer" />
                                <span className="sr-only">Add a project</span>
                            </SidebarGroupAction>
                        </TooltipTrigger>
                        <TooltipContent side="top">Add projects</TooltipContent>
                    </Tooltip>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projectsWithoutInbox.map(project => (
                                <SidebarMenuItem key={project.id}>
                                    {state === "collapsed" ?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton isActive={activeProject?.id === project.id} asChild>
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
                                            <ProjectDropdown project={project}>
                                                <SidebarMenuAction className="opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 cursor-pointer">
                                                    <Ellipsis />
                                                </SidebarMenuAction>
                                            </ProjectDropdown>
                                        </>
                                    }
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Tags</SidebarGroupLabel>
                    <TagAdd>
                        <SidebarGroupAction>
                            <Plus className="text-muted-foreground cursor-pointer" />
                            <span className="sr-only">Add a tag</span>
                        </SidebarGroupAction>
                    </TagAdd>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tags.map(tag => (
                                <SidebarMenuItem key={tag}>
                                    {state === "collapsed" ?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton isActive={activeTag === tag} asChild>
                                                    <Link className="truncate" href={`/app/tag/${tag}`}>
                                                        <Hash />
                                                        <span>{tag}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>{tag}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        :
                                        <>
                                            <SidebarMenuButton isActive={activeTag === tag} asChild>
                                                <Link href={`/app/tag/${tag}`} onClick={() => setOpenMobile(false)}>
                                                    <Hash />
                                                    <span className="truncate">{tag}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            <TagDropdown tag={tag}>
                                                <SidebarMenuAction className="opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 cursor-pointer">
                                                    <Ellipsis />
                                                </SidebarMenuAction>
                                            </TagDropdown>
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
        </Sidebar >
    )
}