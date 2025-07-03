"use client";

import clsx from "clsx";
import { useContext } from "react"
import { TaskNode } from "@/lib/definitions";
import { TasksContext, TasksDispatchContext } from "./providers/TasksContext";
import { DatePicker } from "./app/date-picker";
import { Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import TaskForm from "./app/task-form";
import { Checkbox } from "./ui/checkbox";
import { completeTask } from "@/lib/actions";

export function Task({
    id,
    taskNode
}: {
    id: string,
    taskNode: TaskNode
}) {
    let completeBtnStyle;
    switch (taskNode.priority) {
        case '1':
            completeBtnStyle = "border-red-500 bg-red-100 dark:bg-red-900";
            break;
        case '2':
            completeBtnStyle = "border-amber-500 bg-amber-100 dark:bg-amber-900";
            break;
        case '3':
            completeBtnStyle = "border-sky-500 bg-sky-100 dark:bg-sky-900";
            break;
        default:
            completeBtnStyle = "border-zinc-400 bg-zinc-50 dark:bg-zinc-700";
            break;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
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
                    <div className="grow flex items-center gap-2">
                        <p className={clsx(
                            "font-semibold",
                            taskNode.completed && "line-through text-muted-foreground"
                        )}>{taskNode.name}</p>
                        {taskNode.dueDate &&
                            <DatePicker size="sm" initialDate={taskNode.dueDate} />
                        }
                    </div>
                </div >
            </SheetTrigger>
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