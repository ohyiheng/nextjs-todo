import { fetchTasks } from "@/lib/data";
import TasksProvider from "@/components/providers/TasksContext";
import { TaskContainer } from "@/components/task";
import { SortingProvider } from "@/components/providers/SortingProvider";

export default async function Page() {
    let tasks = await fetchTasks();
    tasks = tasks.filter((task) => task.projectId === null);

    return (
        <TasksProvider tasks={tasks}>
            <SortingProvider>
                <TaskContainer />
            </SortingProvider>
        </TasksProvider>
    )
}