"use client";

import clsx from "clsx";
import { useContext, useEffect, useState } from "react"
import { TaskNode } from "@/lib/definitions";
import { TasksContext } from "../providers/TasksContext";
import { Calendar, ChevronRight, Target } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import TaskForm from "./task-form";
import { Checkbox } from "../ui/checkbox";
import { completeTask } from "@/lib/actions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { computeDueDateColor, computeStartDateColor, getTaskSortingPredicate, partition, taskInFuture } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { activeProjectAtom } from "@/lib/atoms";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DateTime } from "luxon";

export function Task({
    id,
    taskNode
}: {
    id: string,
    taskNode: TaskNode
}) {
    let checkboxColor;
    switch (taskNode.priority) {
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


    return (
        <Dialog>
            <div
                className={clsx(
                    "bg-zinc-50 dark:bg-zinc-900",
                    "relative",
                    "flex items-center gap-4",
                    "px-4 py-2",
                    "border",
                    "rounded-lg cursor-pointer",
                    "text-sm",
                    "group",
                    taskInFuture(taskNode) && "text-muted-foreground"
                )}
            >
                <Checkbox checked={taskNode.completed}
                    onCheckedChange={async () => {
                        console.log(taskNode.completed);
                        await completeTask(taskNode.id, taskNode.completed);
                        taskNode.completed = !taskNode.completed;
                    }}
                    className={clsx(
                        "size-5 rounded-full border-2",
                        checkboxColor
                    )} />
                <DialogTrigger asChild>
                    <div className="grow flex flex-col justify-center gap-1">
                        <p className={clsx(
                            taskNode.completed && "line-through text-muted-foreground"
                        )}>{taskNode.name}</p>
                        <div className="flex items-center gap-2">
                            {taskNode.startDate &&
                                <div className={clsx(
                                    "flex items-center gap-1",
                                    computeStartDateColor(taskNode)
                                )}>
                                    <Calendar strokeWidth={1.5} className="p-0.5" />
                                    <p className="text-xs">{taskNode.startDate && DateTime.fromJSDate(taskNode.startDate).toRelativeCalendar()}</p>
                                </div>
                            }
                            {taskNode.dueDate &&
                                <div className={clsx(
                                    "flex items-center gap-1",
                                    computeDueDateColor(taskNode)
                                )}>
                                    <Target strokeWidth={1.5} className="p-0.5" />
                                    <p className="text-xs">{taskNode.dueDate && DateTime.fromJSDate(taskNode.dueDate).toRelativeCalendar()}</p>
                                </div>
                            }
                        </div>
                    </div>
                </DialogTrigger>
            </div >
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="focus-within:outline-none">
                <DialogHeader className="mb-4">
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <TaskForm task={taskNode} />
            </DialogContent>
        </Dialog>
    )
}

export function TaskContainer() {
    const tasks = useContext(TasksContext);
    if (tasks == null) {
        return;
    }
    const [ pendingTasks, completedTasks ] = partition(tasks, task => !task.completed);
    const activeProject = useAtomValue(activeProjectAtom);

    let sortingPredicate: (a: TaskNode, b: TaskNode) => number;
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
                        <Task key={task.id} id={task.id} taskNode={task} />
                    ))}
                </TaskSection>
            }
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
                                <Task key={task.id} id={task.id} taskNode={task} />
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

export function getTaskById(tasks: TaskNode[], id: string): TaskNode | null {
    let result = tasks.find(task => task.id === id);
    for (let i = 0; i < tasks.length; i++) {
        if (result) {
            break;
        }
        if (tasks[ i ].subTasks !== null) {
            let resultFromSubTree = getTaskById(tasks[ i ].subTasks!, id);
            if (resultFromSubTree) {
                result = resultFromSubTree;
            }
        }
    }
    if (result == undefined) {
        return null;
    }
    return result;
}
