"use client";

import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx";
import { useState } from "react"
import { TaskNode } from "@/lib/definitions";

export function Task({
    id,
    children
}: {
    id: string | number,
    children: React.ReactNode
}) {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id })

    const style = {
        zIndex: isDragging ? 1 : undefined,
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
            className={clsx(
                isDragging && "bg-sky-700/10 border-sky-700/50 dark:bg-sky-400/10 dark:border-sky-300/40",
                !isDragging && "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
                "relative",
                "flex items-center gap-3",
                "px-5 py-2.5 h-12",
                "border",
                "rounded-md cursor-grab",
            )}>

            {!isDragging &&
                <>
                    <button className="w-6 h-6 rounded-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-400 cursor-pointer"></button>
                    {children}
                </>
            }
        </div>
    )
}

export function TaskContainer({ taskList }: { taskList: TaskNode[] }) {
    const [ tasks, setTaskList ] = useState(taskList);
    const ids = tasks.map(task => task.id);
    const [ activeTask, setActiveTask ] = useState<TaskNode | null>(null);

    function handleDragStart(event: DragEndEvent) {
        const taskId = event.active.id as string;
        setActiveTask(getTaskById(tasks, taskId))
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveTask(null);
        if (event.over && event.active.id !== event.over.id) {
            const oldIndex = ids.indexOf(event.active.id as string);
            const newIndex = ids.indexOf(event.over!.id as string);
            setTaskList(arrayMove(tasks, oldIndex, newIndex))
        }
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <TaskSection items={ids}>
                {tasks.map(task => (
                    <Task key={task.id} id={task.id}>{task.name}</Task>
                ))}
            </TaskSection>
            <DragOverlay>
                {activeTask ? (
                    <Task id={activeTask.id}>{activeTask.name}</Task>
                ) : null}
            </DragOverlay>
        </DndContext>


    )
}

function TaskSection({
    items,
    children,
}: {
    items: (string | number)[],
    children?: React.ReactNode
}) {

    return (
        <SortableContext items={items}>
            <div className="p-4 space-y-2">
                {children}
            </div>
        </SortableContext>
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