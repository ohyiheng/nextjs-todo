"use client";

import clsx from "clsx";
import { useContext } from "react"
import { TaskNode } from "@/lib/definitions";
import { TasksContext, TasksDispatchContext } from "./providers/TasksContext";
import useActiveTask from "./providers/ActiveTaskContext";
import { DatePickerChip } from "./app/date-picker";
import { Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export function Task({
    id,
    taskNode
}: {
    id: string,
    taskNode: TaskNode
}) {

    const { activeTask, setActiveTask } = useActiveTask();

    let completeBtnStyle;
    switch (taskNode.priority) {
        case 1:
            completeBtnStyle = "border-red-500 bg-red-100 dark:bg-red-900";
            break;
        case 2:
            completeBtnStyle = "border-amber-500 bg-amber-100 dark:bg-amber-900";
            break;
        case 3:
            completeBtnStyle = "border-sky-500 bg-sky-100 dark:bg-sky-900";
            break;
        default:
            completeBtnStyle = "border-zinc-400 bg-zinc-50 dark:bg-zinc-700";
            break;
    }

    return (
        <div
            className={clsx(
                (activeTask?.id === taskNode.id) && "bg-input",
                (activeTask?.id !== taskNode.id) && "bg-zinc-100 dark:bg-zinc-900",
                "relative",
                "flex items-center gap-4",
                "px-3 py-2",
                "border",
                "rounded-lg cursor-pointer",
                "group",
            )}
            onClick={() => {
                setActiveTask(taskNode);
            }}
        >
            <button className={clsx(
                "w-6 h-6 rounded-full border-2 cursor-pointer",
                completeBtnStyle
            )}></button>
            <div className="grow flex flex-col items-start gap-2">
                <p className="font-medium">{taskNode.name}</p>
                {taskNode.createdAt &&
                    <DatePickerChip initialDate={taskNode.createdAt} />
                }
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="hidden group-hover:inline-flex">
                        <Edit2 />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{taskNode.name}</SheetTitle>
                        <SheetDescription>
                            {taskNode.description}
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export function TaskContainer() {
    const tasks = useContext(TasksContext);
    const dispatch = useContext(TasksDispatchContext);
    if (tasks == null) {
        return;
    }

    return (
        <TaskSection>
            {tasks.map(task => (
                <Task key={task.id} id={task.id} taskNode={task} />
            ))}
        </TaskSection>
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