import clsx from "clsx"

export const btnStyles = {
    base: "font-medium rounded-md cursor-pointer duration-50 ease-in-out border",
    layout: {
        normal: "py-1.5 px-3",
        full: "py-1.5 px-3 w-full",
        icon: "p-1.5",
        chip: "px-2 py-1"
    },
    color: {
        primary: "bg-sky-600 dark:bg-sky-400 text-zinc-50 dark:text-zinc-900 hover:bg-sky-700 dark:hover:bg-sky-500 border-transparent",
        white: "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50",
        transparent: "border-transparent hover:bg-zinc-500/10 dark:hover:bg-zinc-400/20",
        transparentWithBorder: "border-zinc-200 hover:bg-zinc-500/10 dark:border-zinc-600 dark:hover:border-zinc-500",
    }
}

export default function Button({
    children,
    width = "normal",
    onClick,
    color = "transparent",
    type,
    className,
}: {
    children: React.ReactNode,
    width?: "full" | "icon" | "chip" | "normal",
    onClick?: (e?: any) => any
    color?: "primary" | "white" | "transparent",
    type?: "submit" | "reset" | "button",
    className?: string
}) {
    return (
        <button className={clsx(
            color === "white" && btnStyles.color.white,
            color === "primary" && btnStyles.color.primary,
            color === "transparent" && btnStyles.color.transparent,
            width === "normal" && btnStyles.layout.normal,
            width === "full" && btnStyles.layout.full,
            width === "icon" && btnStyles.layout.icon,
            width === "chip" && btnStyles.layout.chip,
            btnStyles.base,
            className
        )} type={type} onClick={onClick}>
            <div className="truncate">{children}</div>
        </button>
    )
}

