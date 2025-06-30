import { ProjectNode, TaskNode } from "@/lib/definitions"
import { useContext, useState } from "react"
import useProjects from "./providers/ProjectsProvider"
import { Check, ChevronDown, ChevronsUpDown } from "lucide-react";
import { autoUpdate, offset, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import clsx from "clsx";

// Takes in a task object, shows what project the task belongs to, and let users assign the task to another project
export function ProjectSelector({
    task
}: {
    task: TaskNode
}) {
    const { projects } = useProjects();
    if (!projects) {
        return <p>No projects</p>;
    }
    const oriProject = projects.find(p => p.id === task.projectId);

    // initialise popover
    const [ isOpen, setIsOpen ] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [ offset(5) ],
        whileElementsMounted: autoUpdate,
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([
        useClick(context),
        useDismiss(context),
        useRole(context),
    ])

    // used to get the width of the selector button, so the popover's width matches
    const projectSelectorBtn = document.getElementById("project-selector-btn");

    return (
        <>
            <button
                ref={refs.setReference}
                {...getReferenceProps()}
                id="project-selector-btn"
                className="px-2 py-1 bg-white dark:bg-neutral-950 hover:bg-neutral-50 border border-neutral-300 dark:border-neutral-700 rounded-md cursor-pointer truncate active:scale-95 duration-75 ease-in-out flex gap-2 items-center justify-between">
                <p className="truncate">{oriProject?.name ?? "Inbox"}</p>
                <ChevronsUpDown className="lucide-small" />
            </button>
            {isOpen &&
                <div
                    ref={refs.setFloating}
                    style={{
                        ...floatingStyles,
                        width: projectSelectorBtn?.offsetWidth
                    }}
                    {...getFloatingProps()}
                    className="py-1 bg-white dark:bg-neutral-950 border border-neutral-300 rounded-md shadow-lg"
                >
                    <div
                    >
                        <button className={clsx(
                            "w-full py-1 px-2 flex items-center cursor-pointer",
                            "hover:bg-neutral-100",
                            !oriProject?.id && "bg-sky-50"
                        )}>
                            <p className="grow text-left">Inbox</p>
                            {!oriProject?.id &&
                                <Check className="p-0.5 stroke-sky-700" />
                            }
                        </button>
                    </div>
                    {mapProjectElements(projects, oriProject)}
                </div>
            }
        </>
    )

    function mapProjectElements(projects: ProjectNode[] | null, oriProject?: ProjectNode, level: number = 0) {
        if (projects) {
            return (
                projects.map((project) => (
                    <div
                        key={project.id}
                    >
                        <button className={clsx(
                            "w-full py-1 px-2 flex items-center cursor-pointer",
                            "hover:bg-neutral-100",
                            project.id === oriProject?.id && "bg-sky-50"
                        )}>
                            <p className={`grow pl-${level * 4} text-left truncate`}>{project.name}</p>
                            {project.id === oriProject?.id &&
                                <Check className="p-0.5 stroke-sky-700" />
                            }
                        </button>
                        <div className="flex flex-col">
                            {
                                project.subProjects &&
                                project.subProjects.length > 0 &&
                                mapProjectElements(project.subProjects, oriProject, level + 1)
                            }
                        </div>
                    </div>
                ))
            )
        }
        return null;
    }
}