"use client";

import clsx from "clsx";
import { useContext, useState } from "react"
import { TaskNode } from "@/lib/definitions";
import { TasksContext, TasksDispatchContext } from "./providers/TasksContext";
import { DatePicker } from "./app/date-picker";
import { ChevronRight, Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import TaskForm from "./app/task-form";
import { Checkbox } from "./ui/checkbox";
import { completeTask } from "@/lib/actions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { partition } from "@/lib/utils";
import useSorting, { sortTasksBy } from "./providers/SortingProvider";

export function Task({
    id,
    taskNode
}: {
    id: string,
    taskNode: TaskNode
}) {
    let completeBtnStyle;
    switch (taskNode.priority) {
        case '3':
            completeBtnStyle = "border-red-500 bg-red-100 dark:bg-red-900/50";
            break;
        case '2':
            completeBtnStyle = "border-amber-500 bg-amber-100 dark:bg-amber-900/50";
            break;
        case '1':
            completeBtnStyle = "border-sky-500 bg-sky-100 dark:bg-sky-900/50";
            break;
        default:
            completeBtnStyle = "border-zinc-400 bg-zinc-50 dark:bg-zinc-900/50";
            break;
    }

    return (
        <Sheet>
            <div
                className={clsx(
                    "bg-zinc-100 dark:bg-zinc-900",
                    "relative",
                    "flex items-center gap-4",
                    "px-4 py-2",
                    "border",
                    "rounded-lg cursor-pointer",
                    "group",
                )}
            >
                <Checkbox checked={taskNode.completed}
                    onCheckedChange={async () => {
                        console.log(taskNode.completed);
                        await completeTask(taskNode.id, taskNode.completed);
                        taskNode.completed = !taskNode.completed;
                    }}
                    className={clsx(
                        "size-5 rounded-full",
                        completeBtnStyle
                    )} />
                <SheetTrigger asChild>
                    <div className="grow flex items-center gap-2">
                        <p className={clsx(
                            "font-semibold",
                            taskNode.completed && "line-through text-muted-foreground"
                        )}>{taskNode.name}</p>
                        {taskNode.dueDate &&
                            <DatePicker size="sm" initialDate={taskNode.dueDate} />
                        }
                    </div>
                </SheetTrigger>
            </div >
            <SheetContent className="w-screen md:w-[700px] h-full">
                <SheetHeader>
                    <SheetTitle>Edit Task</SheetTitle>
                </SheetHeader>
                <div className="px-4 h-full">
                    <TaskForm task={taskNode} />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export function TaskContainer() {
    const tasks = useContext(TasksContext);
    if (tasks == null) {
        return;
    }
    const [ pendingTasks, completedTasks ] = partition(tasks, task => !task.completed);
    const [ open, setOpen ] = useState(false);
    const { sort } = useSorting();

    let sortingPredicate: (a: TaskNode, b: TaskNode) => number;
    switch (sort.by) {
        case "priority": {
            sortingPredicate = (a, b) => {
                return sort.order === "asc"
                    ? parseInt(a.priority) - parseInt(b.priority)
                    : parseInt(b.priority) - parseInt(a.priority)
            };
            break;
        }
        case "dueDate": {
            sortingPredicate = (a, b) => {
                return sort.order === "asc"
                    ? (a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER)
                    : (b.dueDate?.getTime() ?? 0) - (a.dueDate?.getTime() ?? 0)
            }
            break;
        }
        default: {
            sortingPredicate = (a, b) => {
                return sort.order === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            }
        }
    }

    return (
        <div className="space-y-6">
            {pendingTasks.length > 0 &&
                <TaskSection>
                    {tasks.filter(task => !task.completed).sort(sortingPredicate).map(task => (
                        <Task key={task.id} id={task.id} taskNode={task} />
                    ))}
                </TaskSection>
            }
            {completedTasks.length > 0 &&
                <Collapsible open={open} onOpenChange={setOpen}>
                    <TaskSection>
                        <CollapsibleTrigger>
                            <div className="flex items-center gap-1 cursor-pointer">
                                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                                <ChevronRight className={clsx(
                                    "stroke-muted-foreground",
                                    "duration-100 ease-in-out",
                                    open && "rotate-90"
                                )} />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {tasks.filter(task => task.completed).map(task => (
                                <Task key={task.id} id={task.id} taskNode={task} />
                            ))}
                        </CollapsibleContent>
                    </TaskSection>
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