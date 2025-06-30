import { App } from "@/components/app/app";
import TasksProvider from "@/components/providers/TasksContext";
import TitleProvider from "@/components/providers/TitleProvider";
import { fetchProjectsById, fetchTasks } from "@/lib/data";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const project = await fetchProjectsById(id);
    const tasks = await fetchTasks(id);

    return (
        <TasksProvider tasks={tasks}>
                <App />
        </TasksProvider>
    )
}