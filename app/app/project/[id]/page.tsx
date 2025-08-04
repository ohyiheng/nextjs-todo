import { TaskContainer } from "@/components/app/task/task";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    // TODO: check if project with given id exists

    return (
        <TaskContainer projectId={parseInt(id)} />
    )
}