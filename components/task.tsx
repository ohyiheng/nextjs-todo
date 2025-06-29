"use client";

import { DndContext, DragEndEvent, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx";
import { Dispatch, useContext, useId, useState } from "react"
import { TaskNode } from "@/lib/definitions";
import { TasksContext, TasksDispatchContext } from "./context/TasksContext";
import useActiveTask from "./context/ActiveTaskContext";

export function Task({
    id,
    taskNode,
    setIsEditing
}: {
    id: string,
    taskNode: TaskNode,
    setIsEditing: Dispatch<boolean>
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
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
            className={clsx(
                (activeTask?.id === taskNode.id) && "bg-sky-50 border-sky-600 dark:bg-sky-950",
                (activeTask?.id !== taskNode.id && !isDragging) && "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700",
                isDragging && "bg-sky-700/10 border-sky-700/50 dark:bg-sky-400/10 dark:border-sky-300/40",
                "relative",
                "flex items-center gap-3",
                "px-3 h-14",
                "border",
                "rounded-md cursor-pointer",
            )}
            onClick={() => {
                setActiveTask(taskNode);
                setIsEditing(false);
            }}
        >
            {!isDragging &&
                <>
                    <button className={clsx(
                        "w-6 h-6 rounded-full border-2 cursor-pointer",
                        completeBtnStyle
                    )}></button>
                    {taskNode.name}
                </>
            }
        </div>
    )
}

export function TaskContainer({
    setIsEditing
}: {
    setIsEditing: Dispatch<boolean>
}) {
    const tasks = useContext(TasksContext);
    const dispatch = useContext(TasksDispatchContext);
    if (tasks == null) {
        return;
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 100
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 50
            }
        })
    )

    const [ draggingTask, setDraggingTask ] = useState<TaskNode | null>(null);
    const ids = tasks.map(task => task.id);

    function handleDragStart(event: DragEndEvent) {
        const taskId = event.active.id as string;
        setDraggingTask(getTaskById(tasks!, taskId))
    }

    function handleDragEnd(event: DragEndEvent) {
        setDraggingTask(null);
        if (event.over && event.active.id !== event.over.id) {
            const oldIndex = ids.indexOf(event.active.id as string);
            const newIndex = ids.indexOf(event.over!.id as string);
            dispatch({
                type: "move",
                oldIndex: oldIndex,
                newIndex: newIndex
            });
        }
    }

    const id = useId();

    return (
        <DndContext
            id={id}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            <TaskSection items={ids}>
                {tasks.map(task => (
                    <Task key={task.id} id={task.id} taskNode={task} setIsEditing={setIsEditing} />
                ))}
            </TaskSection>
            <DragOverlay>
                {draggingTask ? (
                    <Task key={draggingTask.id} id={draggingTask.id} taskNode={draggingTask} setIsEditing={setIsEditing} />
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

    const id = useId();

    return (
        <SortableContext id={id} items={items}>
            <div className="space-y-2">
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