"use client";

import { Check, PanelRightClose } from "lucide-react";
import useActiveTask from "./context/ActiveTaskContext";
import clsx from "clsx";
import Button from "./button";
import { useState } from "react";

export default function RightPanel() {
    const { activeTask, setActiveTask } = useActiveTask();
    const [ isEditing, setIsEditing ] = useState(false);

    return (
        <div className={clsx(
            !activeTask && "-mr-(--right-panel-width)",
            "w-(--right-panel-width) h-full p-(--outer-padding)",
            "bg-white dark:bg-zinc-900",
            "border-l border-zinc-300 dark:border-zinc-700",
            "duration-200 ease-in-out"
        )}>
            <form action="" className="h-full">
                <div className="h-full flex flex-col">
                    <div className="flex items-center gap-2">
                        <Button width="icon" onClick={(e) => {
                            e.preventDefault();
                            setActiveTask(null);
                        }}>
                            <PanelRightClose />
                        </Button>
                        <input type="text" defaultValue={activeTask?.name}
                            className="grow px-1 outline-none font-semibold text-lg truncate
                            focus:border-b-2 focus:border-neutral-400"
                            onFocus={() => { setIsEditing(true) }}
                        />
                    </div>
                    {isEditing &&
                        <div>
                            <Button>
                                <Check />
                            </Button>
                        </div>
                    }
                </div>
            </form>
        </div>
    )
}