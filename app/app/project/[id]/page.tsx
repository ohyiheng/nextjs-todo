import { App } from "@/components/app";
import TasksProvider from "@/components/context/TasksContext";
import { fetchTasks } from "@/lib/data";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const tasks = await fetchTasks(id);

    return (
        <TasksProvider tasks={tasks}>
            <App />
        </TasksProvider>
    )
}