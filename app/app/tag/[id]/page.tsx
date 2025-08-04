import { TaskContainer } from "@/components/app/task/task";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const tagId = (await params).id
    return (
        <TaskContainer tagId={tagId} />
    )
}