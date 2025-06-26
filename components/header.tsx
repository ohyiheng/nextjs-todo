export default function Header({
    title
}: {
    title: string
}) {
    return (
        <header className="pt-(--outer-padding) px-4 w-full flex justify-between items-center">
            <h1 className="text-2xl">{title}</h1>
            <div></div>
        </header>
    )
}