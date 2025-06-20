import clsx from "clsx"
import Link from "next/link"
import { btnStyles } from "@/components/button"
import { Search } from "iconoir-react"

export default function Sidebar({
    children, collapsed
}: Readonly<{
    children: React.ReactNode, collapsed?: boolean | null
}>) {
    return (
        <div className={`
            ${collapsed && "-ml-(--sidebar-width)"}
            w-(--sidebar-width) min-h-screen h-full
            p-3 space-y-4
            bg-neutral-100 dark:bg-neutral-900
            border-r border-r-neutral-200 dark:border-r-neutral-700
            duration-200 ease-out
        `}>
            {children}
        </div>
    )
}

export function SidebarLink({
    href,
    title,
    icon,
}: Readonly<{
    href: string,
    title: string,
    icon?: any,
}>) {
    return (
        <Link href={href} className={clsx(
            btnStyles.base,
            btnStyles.layout.full,
            btnStyles.color.transparent,
            "w-full block"
        )}>
            {icon ?
                <div title={title} className="flex items-center gap-1.5 truncate">
                    {icon}
                    {title}
                </div>
                :
                <div title={title} className="truncate">
                    {title}
                </div>
            }

        </Link>
    )
}

export function SidebarSearch() {
    return (
        <button className={clsx(
            btnStyles.base,
            btnStyles.layout.full,
            btnStyles.color.white,
            "rounded-full"
        )}>
            <div className="flex items-center justify-center gap-2">
                <Search />
                Search
            </div>
        </button>
    )
}
