"use client";

import { ProjectNode } from "@/lib/definitions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import useProjects from "../providers/ProjectsProvider";
import { JSX, useState } from "react";
import React from "react";
import { FormControl } from "../ui/form";
import { UseFormSetValue } from "react-hook-form";
import { TaskFormType } from "./task-form";
import { useAtomValue } from "jotai";
import { activeProjectAtom } from "@/lib/atoms";

export default function ProjectCombobox({
    value,
    setValue
}: {
    value: number,
    setValue: UseFormSetValue<TaskFormType>
}) {
    const { projects } = useProjects();
    const activeProject = useAtomValue(activeProjectAtom);
    const [ isOpen, setIsOpen ] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="font-normal"
                    >
                        <span>
                            {value ? activeProject?.name : "Pick a project"}
                        </span>
                        <ChevronsUpDown />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command filter={(value, search, keywords) => {
                    if (keywords?.join(' ').toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search projects..." />
                    <CommandList>
                        <CommandEmpty>No projects found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                keywords={[ "Inbox" ]}
                                onSelect={() => {
                                    setValue("projectId", 1);
                                    setIsOpen(false);
                                }}
                            >
                                Inbox
                            </CommandItem>
                        </CommandGroup>
                            <CommandSeparator />
                        <CommandGroup>
                            {mapAllProjects(projects.filter(project => project.id !== 1))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )

    function mapAllProjects(projects: ProjectNode[] | null): JSX.Element[] {
        if (projects && projects.length > 0) {
            return projects.map((project) => (
                <React.Fragment key={project.id}>
                    <CommandItem
                        keywords={project.name.split(' ')}
                        onSelect={() => {
                            setValue("projectId", project.id);
                            setIsOpen(false);
                        }}
                    >
                        {project.name}
                    </CommandItem>
                    {mapAllProjects(project.subProjects)}
                </React.Fragment>
            ))
        }
        return [];
    }
}