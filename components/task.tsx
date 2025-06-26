"use client";

import { DndContext, DragEndEvent, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx";
import { useContext, useId, useState } from "react"
import { TaskNode } from "@/lib/definitions";
import { ActiveTaskDispatchContext } from "./context/ActiveTaskContext";
import { TasksContext, TasksDispatchContext } from "./context/TasksContext";

export function Task({
    id,
    taskNode
}: {
    id: string,
    taskNode: TaskNode
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

    const setActiveTask = useContext(ActiveTaskDispatchContext);

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
            completeBtnStyle = "border-neutral-400 bg-neutral-50 dark:bg-neutral-700";
            break;
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
            className={clsx(
                isDragging && "bg-sky-700/10 border-sky-700/50 dark:bg-sky-400/10 dark:border-sky-300/40",
                !isDragging && "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
                "relative",
                "flex items-center gap-3",
                "px-3 h-14",
                "border",
                "rounded-md cursor-pointer",
            )}
            onClick={() => {
                setActiveTask(taskNode);
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

export function TaskContainer() {
    const tasks = useContext(TasksContext);
    const dispatch = useContext(TasksDispatchContext);
    if (tasks == null) {
        return;
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 100,
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
                    <Task key={task.id} id={task.id} taskNode={task} />
                ))}
            </TaskSection>
            <DragOverlay>
                {draggingTask ? (
                    <Task key={draggingTask.id} id={draggingTask.id} taskNode={draggingTask} />
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