import { TaskContainer } from "@/components/task";
import { fetchTasks } from "@/lib/data";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const tasks = await fetchTasks(id);
    return (
        <>
            <TaskContainer taskList={tasks} />
            <div>something</div>
        </>
    )
}