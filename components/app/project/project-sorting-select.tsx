"use client";

import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { ArrowDownUp, Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { SortByType } from "@/lib/definitions";
import { updateProjectSort } from "@/lib/actions";
import { useAtom } from "jotai";
import { activeProjectAtom } from "@/lib/atoms";

export default function ProjectSortingSelect() {
    const [ activeProject, setActiveProject ] = useAtom(activeProjectAtom);

    const sortBy: {
        name: string,
        value: SortByType
    }[] = [
            {
                name: "Priority",
                value: "priority"
            },
            {
                name: "Start date",
                value: "start",
            },
            {
                name: "Due date",
                value: "due"
            },
            {
                name: "Name",
                value: "name"
            }
        ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                    <ArrowDownUp />
                    <ChevronDown className="lucide-small" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 w-[200px]">
                <Command>
                    <CommandList>
                        <CommandGroup heading="Sort by">
                            {sortBy.map(sort => (
                                <CommandItem
                                    key={sort.value}
                                    onSelect={async () => {
                                        setActiveProject({
                                            ...activeProject!,
                                            sortBy: sort.value
                                        })
                                        await updateProjectSort(activeProject!.id, sort.value)
                                    }}
                                >
                                    {sort.name}
                                    <Check className={clsx(
                                        "ml-auto",
                                        activeProject?.sortBy === sort.value ? "opacity-100" : "opacity-0"
                                    )} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Order">
                            <CommandItem
                                onSelect={async () => {
                                    setActiveProject({
                                        ...activeProject!,
                                        sortOrder: "asc"
                                    })
                                    await updateProjectSort(activeProject!.id, undefined, "asc")
                                }}>
                                Ascending
                                <Check className={clsx(
                                    "ml-auto",
                                    activeProject?.sortOrder === "asc" ? "opacity-100" : "opacity-0"
                                )} />
                            </CommandItem>
                            <CommandItem
                                onSelect={async () => {
                                    setActiveProject({
                                        ...activeProject!,
                                        sortOrder: "desc"
                                    })
                                    await updateProjectSort(activeProject!.id, undefined, "desc")
                                }}>
                                Descending
                                <Check className={clsx(
                                    "ml-auto",
                                    activeProject?.sortOrder === "desc" ? "opacity-100" : "opacity-0"
                                )} />
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}