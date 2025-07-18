"use client";

import clsx from "clsx";
import { useContext, useEffect, useState } from "react"
import type { Task } from "@/lib/definitions";
import { TasksContext, TasksDispatchContext } from "../providers/TasksContext";
import { Calendar, ChevronRight, Ellipsis, Plus, Target, Trash } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { completeTask, deleteTask } from "@/lib/actions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { computeDueDateColor, computeStartDateColor, getTaskSortingPredicate, partition, taskInFuture } from "@/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { activeProjectAtom, addTaskDialogOpenAtom } from "@/lib/atoms";
import { DateTime } from "luxon";
import { Button } from "../ui/button";
import TaskEdit from "./task-edit";
import { Card, CardContent } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function Task({
    id,
    task
}: {
    id: string,
    task: Task
}) {
    let checkboxColor;
    switch (task.priority) {
        case '3':
            checkboxColor = "border-red-500 bg-red-100 dark:bg-red-900/20";
            break;
        case '2':
            checkboxColor = "border-amber-500 bg-amber-100 dark:bg-amber-900/20";
            break;
        case '1':
            checkboxColor = "border-sky-500 bg-sky-100 dark:bg-sky-900/20";
            break;
        default:
            checkboxColor = "border-zinc-400 bg-zinc-50 dark:bg-zinc-900/20";
            break;
    }

    const [ open, setOpen ] = useState(false);

    const dispatch = useContext(TasksDispatchContext);

    return (
        <Card
            className={clsx(
                "relative",
                "py-2",
                "border",
                "shadow-xs",
                "cursor-pointer",
                "text-sm",
                "group",
                taskInFuture(task) && "text-muted-foreground"
            )}
        >
            <CardContent className="px-4 flex justify-between">
                <div className="flex items-center gap-4 grow">
                    <Checkbox checked={task.completed}
                        onCheckedChange={async () => {
                            console.log(task.completed);
                            await completeTask(task.id, task.completed);
                            task.completed = !task.completed;
                        }}
                        className={clsx(
                            "size-5 rounded-full border-2",
                            checkboxColor
                        )} />
                    <div className="grow flex flex-col justify-center gap-1" onClick={() => setOpen(true)}>
                        <p className={clsx(
                            task.completed && "line-through text-muted-foreground"
                        )}>{task.name}</p>
                        {(task.startDate || task.dueDate) &&
                            <div className="flex items-center gap-3">
                                {task.startDate &&
                                    <div className={clsx(
                                        "flex items-center gap-1.5",
                                        computeStartDateColor(task)
                                    )}>
                                        <Calendar strokeWidth={1.5} className="size-4" />
                                        <p className="text-xs">{task.startDate && DateTime.fromJSDate(task.startDate).toRelativeCalendar()}</p>
                                    </div>
                                }
                                {task.dueDate &&
                                    <div className={clsx(
                                        "flex items-center gap-1.5",
                                        computeDueDateColor(task)
                                    )}>
                                        <Target strokeWidth={1.5} className="size-4" />
                                        <p className="text-xs">{task.dueDate && DateTime.fromJSDate(task.dueDate).toRelativeCalendar()}</p>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <Ellipsis />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={async () => {
                            if (dispatch) dispatch({ type: "delete", id: task.id });
                            await deleteTask(task.id);
                        }}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {open &&
                    <TaskEdit task={task} open={open} setOpen={setOpen} />
                }
            </CardContent>
        </Card>
    )
}

export function TaskContainer({ projectId }: { projectId: number }) {
    const tasks = useContext(TasksContext);
    if (tasks == null) {
        return;
    }

    const filteredTasks = tasks.filter((task) => task.projectId === projectId);

    const [ pendingTasks, completedTasks ] = partition(filteredTasks, task => !task.completed);
    const activeProject = useAtomValue(activeProjectAtom);
    const setAddTaskDialogOpen = useSetAtom(addTaskDialogOpenAtom);

    let sortingPredicate: (a: Task, b: Task) => number;
    sortingPredicate = getTaskSortingPredicate(activeProject ?? undefined);

    const [ mounted, setMounted ] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            {pendingTasks.length > 0 &&
                <TaskSection>
                    {pendingTasks.sort(sortingPredicate).map(task => (
                        <Task key={task.id} id={task.id} task={task} />
                    ))}
                </TaskSection>
            }
            <Button variant="outline" className="w-full cursor-pointer"
                onClick={() => setAddTaskDialogOpen(true)}
            >
                <Plus />
                Add task
            </Button>
            {completedTasks.length > 0 &&
                <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger asChild>
                        <button className="mb-2 flex items-center gap-1 cursor-pointer group">
                            <p className="text-sm text-muted-foreground font-medium">Completed</p>
                            <ChevronRight className={clsx(
                                "stroke-muted-foreground",
                                "duration-100 ease-in-out",
                                "group-data-[state=open]:rotate-90"
                            )} />
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <TaskSection>
                            {completedTasks.map(task => (
                                <Task key={task.id} id={task.id} task={task} />
                            ))}
                        </TaskSection>
                    </CollapsibleContent>
                </Collapsible>
            }
        </div>
    )
}

function TaskSection({
    children,
}: {
    children?: React.ReactNode
}) {
    return (
        <div className="space-y-2">
            {children}
        </div>
    )
}