import TasksProvider from "@/components/providers/TasksContext";
import { TaskContainer } from "@/components/app/task";
import { fetchTasks } from "@/lib/data";

export default async function Page({
    params
}: {
    params: Promise<{ id: number }>
}) {
    const { id } = await params;
    const tasks = await fetchTasks(id);

    return (
        <TasksProvider tasks={tasks}>
            <TaskContainer />
        </TasksProvider>
    )
}