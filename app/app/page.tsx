import { fetchTasks } from "@/lib/data";
import { App } from "@/components/app"
import TasksProvider from "@/components/context/TasksContext";

export default async function Page() {
    let tasks = await fetchTasks();
    tasks = tasks.filter((task) => task.projectId === null);

    return (
        <TasksProvider tasks={tasks}>
            <App/>
        </TasksProvider>
    )
}