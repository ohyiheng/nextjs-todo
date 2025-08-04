"use client";

import { activeProjectAtom, activeTagAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { Hash } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppTitle() {
    const activeProject = useAtomValue(activeProjectAtom);
    const activeTag = useAtomValue(activeTagAtom);
    const pathname = usePathname();

    let title: string | undefined;
    if (activeProject) {
        title = activeProject.name;
    } else if (activeTag) {
        title = activeTag;
    } else {
        title = pathname?.split('/')[ 2 ];
        title = title?.replace(title[ 0 ], title[ 0 ].toLocaleUpperCase());
    }

    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return undefined;
    }

    return (
        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 md:max-w-3/5 flex items-center gap-3 truncate">
            <div className="flex items-center gap-1 text-lg md:text-xl lg:text-2xl truncate">
                {activeTag && <Hash />}
                <h1 className="truncate">{title ?? "Tugas"}</h1>
            </div>
        </div>
    )
}