import { TaskContainer } from "@/components/app/task";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const tagId = parseInt((await params).id)
    return (
        <TaskContainer tagId={tagId} />
    )
}