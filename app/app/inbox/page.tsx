import { fetchTasks } from "@/lib/data";
import TasksProvider from "@/components/providers/TasksContext";
import { TaskContainer } from "@/components/task";

export default async function Page() {
    let tasks = await fetchTasks();
    tasks = tasks.filter((task) => task.projectId === 1);

    return (
        <TasksProvider tasks={tasks}>
            <TaskContainer />
        </TasksProvider>
    )
}