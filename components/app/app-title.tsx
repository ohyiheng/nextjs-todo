"use client";

import { activeProjectAtom, activeTagAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectDropdown from "./project/project-dropdown";
import useTags from "../providers/TagsProvider";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import useProjects from "../providers/ProjectsProvider";
import TagDropdown from "./tag/tag-dropdown";


export default function AppTitle() {
    const activeProject = useAtomValue(activeProjectAtom);
    const activeTag = useAtomValue(activeTagAtom);
    const { inboxId } = useProjects();
    const tags = useTags();
    const pathname = usePathname();

    let title;
    if (activeProject) {
        title = activeProject.name;
    } else {
        title = pathname.split('/')[ 2 ];
        if (title === "tag") {
            title = pathname.split('/')[ 3 ] ?? "Tag not found"
        } else {
            title = title.replace(title[ 0 ], title[ 0 ].toLocaleUpperCase());
        }
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
            {activeProject && activeProject?.id !== inboxId &&
                <ProjectDropdown project={activeProject}>
                    <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <Ellipsis />
                    </Button>
                </ProjectDropdown>
            }
            {activeTag &&
                <TagDropdown tag={activeTag}>
                    <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <Ellipsis />
                    </Button>
                </TagDropdown>
            }
        </div>
    )
}