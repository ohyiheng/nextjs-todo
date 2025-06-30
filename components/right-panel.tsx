"use client";

import { ChevronDown, Edit, PanelRightClose } from "lucide-react";
import useActiveTask from "./providers/ActiveTaskContext";
import clsx from "clsx";
import Button from "./button";
import { Dispatch, useContext, useState } from "react";
import { TaskNode } from "@/lib/definitions";
import useProjects from "./providers/ProjectsProvider";
import { ProjectSelector } from "./selectors";

export default function RightPanel({
    isEditing,
    setIsEditing
}: {
    isEditing: boolean,
    setIsEditing: Dispatch<boolean>
}) {
    const { activeTask, setActiveTask } = useActiveTask();
    const [ originalTask, setOriginalTask ] = useState<TaskNode | null>(null);
    const [ confirmCancelPopUp, setConfirmCancelPopUp ] = useState(false);
    const { projects } = useProjects();

    let projectName;
    if (activeTask?.projectId) {
        projectName = projects?.find(p => p.id === activeTask.projectId)?.name ?? "Unknown";
    } else {
        projectName = "Inbox";
    }

    return (
        <div className={clsx(
            !activeTask && "-mr-(--right-panel-width)",
            "w-(--right-panel-width) h-full py-(--outer-padding) pl-3 pr-5",
            "bg-neutral-100 dark:bg-zinc-900",
            "border-l border-zinc-300 dark:border-zinc-700",
            "duration-200 ease-in-out"
        )}>
            <form action="">
                <div className="h-full flex flex-col gap-2">
                    {/* Top bar */}
                    <div className="flex items-center justify-between">
                        <Button width="icon" onClick={(e) => {
                            e.preventDefault();
                            setActiveTask(null);
                        }}>
                            <PanelRightClose />
                        </Button>
                        <Button width="icon" onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(true);
                            setOriginalTask(activeTask);
                        }}>
                            <Edit />
                        </Button>
                    </div>
                    {isEditing ?
                        <div className="space-y-2">
                            <input type="text" name="name"
                                value={activeTask?.name ?? ""}
                                className="grow p-1.5 outline-none font-semibold text-lg truncate
                            bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:border-neutral-600 dark:focus:border-neutral-400 rounded-md"
                                onChange={(e) => {
                                    setActiveTask({
                                        ...activeTask!,
                                        name: e.target.value
                                    })
                                }}
                            />
                            <textarea name="description"
                                value={activeTask?.description ?? ""}
                                className="w-full h-24 p-1.5 outline-none overflow-ellipsis
                            bg-white dark:bg-neutral-800 border border-neutral-300  dark:border-neutral-700 focus:border-neutral-600 dark:focus:border-neutral-400 rounded-md text-sm resize-none"
                                onChange={(e) => {
                                    setActiveTask({
                                        ...activeTask!,
                                        description: e.target.value
                                    })
                                }}
                            />
                        </div>
                        :
                        <div>
                            <h2 className="grow p-1.5 outline-none font-semibold text-lg truncate border border-transparent">
                                {activeTask?.name}
                            </h2>
                            <p className="w-full max-h-24 p-1.5 outline-none text-sm text-neutral-700 dark:text-neutral-300 overflow-ellipsis
                            border border-transparent">
                                {activeTask?.description}
                            </p>
                        </div>
                    }
                    {isEditing &&
                        <div className="flex justify-end items-center gap-2">
                            <Button color="white"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if ((activeTask?.name === originalTask?.name) &&
                                        (activeTask?.description === originalTask?.description)) {
                                        setIsEditing(false);
                                    } else {
                                        setConfirmCancelPopUp(true);
                                    }
                                }}>
                                Cancel
                            </Button>
                            <Button color="primary">
                                Save
                            </Button>
                        </div>
                    }
                </div>
            </form>
            <hr className="my-2 border-neutral-300 dark:border-neutral-700" />

            <div className="p-1.5 grid grid-cols-[1fr_2.5fr] items-center gap-3">
                <p className="font-semibold truncate">Project</p>
                {activeTask && <ProjectSelector task={activeTask} />}
            </div>

            {confirmCancelPopUp &&
                <div className="absolute flex top-0 left-0 h-full w-full bg-neutral-950/30 dark:bg-neutral-950/80">
                    <div className="relative p-4 w-max h-max top-1/2 left-1/2 -translate-1/2 space-y-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md">
                        <p>Are you sure you want to discard changes?</p>
                        <div className="flex gap-3 justify-end">
                            <Button color="white"
                                onClick={() => {
                                    setIsEditing(false);
                                    setActiveTask(originalTask);
                                    setConfirmCancelPopUp(false);
                                }}>
                                Yes
                            </Button>
                            <Button color="primary"
                                onClick={() => {
                                    setConfirmCancelPopUp(false);
                                }}>
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>

    )
}