import clsx from "clsx"

export const btnStyles = {
    base: "font-medium rounded-md cursor-pointer duration-75 ease-in-out border",
    layout: {
        normal: "py-1.5 px-3",
        full: "py-1.5 px-3 w-full",
        icon: "p-1.5"
    },
    color: {
        primary: "bg-sky-600 text-neutral-50 hover:bg-sky-700 border-transparent",
        white: "bg-white hover:bg-neutral-50 border-neutral-200 hover:border-sky-800/70",
        transparent: "border-transparent hover:bg-neutral-500/10",
        transparentWithBorder: "border-neutral-200 hover:bg-neutral-500/10",
    }
}

export default function Button({
    children,
    width = "normal",
    onClick,
    color = "transparent",
}: {
    children: React.ReactNode,
    width?: "full" | "icon" | "normal",
    onClick?: any
    color?: "primary" | "secondary" | "white" | "transparent",
}) {
    return (
        <button className={clsx(
            color === "white" && btnStyles.color.white,
            color === "primary" && btnStyles.color.primary,
            color === "transparent" && btnStyles.color.transparent,
            width === "normal" && btnStyles.layout.normal,
            width === "full" && btnStyles.layout.full,
            width === "icon" && btnStyles.layout.icon,
            btnStyles.base
        )} onClick={onClick}>
            <div className="truncate">{children}</div>
        </button>
    )
}

