"use client";

import { activeProjectAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export default function AppTitle() {
    const activeProject = useAtomValue(activeProjectAtom);
    const pathname = usePathname();

    let title;
    if (activeProject) {
        title = activeProject.name;
    } else {
        title = pathname.split('/')[ 2 ];
    }

    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return undefined;
    }

    return (
        <h1 className="text-2xl">{title}</h1>
    )
}