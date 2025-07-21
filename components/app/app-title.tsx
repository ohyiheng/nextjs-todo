"use client";

import { activeProjectAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectDropdown from "./project-dropdown";


export default function AppTitle() {
    const activeProject = useAtomValue(activeProjectAtom);
    const pathname = usePathname();

    let title;
    if (activeProject) {
        title = activeProject.name;
    } else {
        title = pathname.split('/')[ 2 ];
        title = title.replace(title[0], title[0].toLocaleUpperCase());
    }

    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return undefined;
    }

    return (
        <div className="flex items-center gap-3 truncate">
            <h1 className="text-lg md:text-xl lg:text-2xl truncate">{title}</h1>
            {activeProject && activeProject?.id !== 1 &&
                <ProjectDropdown project={activeProject} />
            }
        </div>
    )
}