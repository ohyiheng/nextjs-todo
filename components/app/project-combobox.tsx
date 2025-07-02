"use client";

import { ProjectNode } from "@/lib/definitions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import useProjects from "../providers/ProjectsProvider";
import { JSX, useState } from "react";
import React from "react";
import { FormControl } from "../ui/form";
import { getProjectNameFromId } from "@/lib/utils";
import { UseFormSetValue } from "react-hook-form";
import { z } from "zod/v4";
import { TaskFormSchema } from "./task-form";

export default function ProjectCombobox({
    value,
    setValue
}: {
    value: string | null,
    setValue: UseFormSetValue<z.infer<typeof TaskFormSchema>>
}) {
    const { projects } = useProjects();
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
                            {value ? getProjectNameFromId(projects, value) : "Pick a project"}
                        </span>
                        <ChevronsUpDown />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent>
                <Command filter={(value, search, keywords) => {
                    if (keywords?.join(' ').toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search projects..." />
                    <CommandList>
                        <CommandEmpty>No projects found.</CommandEmpty>
                        <CommandGroup>
                            {mapAllProjects(projects)}
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
                        value={project.id}
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