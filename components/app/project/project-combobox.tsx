"use client";

import { TaskFormType } from "@/lib/definitions";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../../ui/command";
import useProjects from "../../providers/ProjectsProvider";
import { useState } from "react";
import React from "react";
import { FormControl } from "../../ui/form";
import { UseFormSetValue } from "react-hook-form";
import { getProjectById } from "@/lib/utils";

export default function ProjectCombobox({
    value,
    setValue,
    variant
}: {
    value: number,
    setValue: UseFormSetValue<TaskFormType>,
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null
}) {
    const { projects, inboxId } = useProjects();
    const [ isOpen, setIsOpen ] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant={variant}
                        role="combobox"
                        className="font-normal truncate"
                    >
                        <span className="max-w-[140px] sm:max-w-[200px] truncate">
                            {value ? getProjectById(projects, value)?.name : <span className="text-muted-foreground">Pick a project</span>}
                        </span>
                        <ChevronsUpDown strokeWidth={1} className="opacity-50" />
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
                                    setValue("projectId", inboxId!);
                                    setIsOpen(false);
                                }}
                            >
                                Inbox
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                            {projects.filter(project => !project.isInbox).map(project => (
                                <CommandItem
                                    key={project.id}
                                    keywords={project.name.split(' ')}
                                    onSelect={() => {
                                        setValue("projectId", project.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    {project.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}