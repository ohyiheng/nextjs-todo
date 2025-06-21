import AppSidebar from "@/components/sidebar";
import { TaskContainer } from "@/components/task";
import { fetchProjects, fetchTasks } from "@/lib/data";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const projects = await fetchProjects();
    const tasks = await fetchTasks();
    console.dir(tasks, { depth: null })

    return (
        <AppSidebar projects={projects}>
            <TaskContainer taskList={tasks} />
        </AppSidebar>
    );
}
