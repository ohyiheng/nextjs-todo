import { App } from "@/components/app";
import { ProjectContext } from "@/components/context/ProjectContext";
import TasksProvider from "@/components/context/TasksContext";
import TitleProvider from "@/components/context/TitleContext";
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
            <TitleProvider defaultTitle={project?.name ?? ""}>
                <App />
            </TitleProvider>
        </TasksProvider>
    )
}