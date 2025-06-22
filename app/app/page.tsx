import { TaskContainer } from "@/components/task";
import { fetchTasks } from "@/lib/data";

export default async function Page() {
    let tasks = await fetchTasks();
    tasks = tasks.filter((task) => task.projectId === null);
    return (
        <TaskContainer taskList={tasks} />
    )
}