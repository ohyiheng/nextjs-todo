"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb";

export default function AppBreadcrumb() {
    const pathname = usePathname();
    const paths = pathname.split('/').slice(2, -1);
    console.log(paths);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/app">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {paths.length > 0 &&
                    paths.map(path => (
                        <>
                            <BreadcrumbItem key={path}>
                                <BreadcrumbLink href={`/app/${path}`}>Projects</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    ))
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}