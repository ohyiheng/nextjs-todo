import ActiveProjectUpdater from "@/components/app/active-project-updater";
import AddTask from "@/components/app/task-add";
import { AppSidebar } from "@/components/app/app-sidebar";
import AppTitle from "@/components/app/app-title";
import ProjectSortingSelect from "@/components/app/project-sorting-select";
import Providers from "@/components/providers/Providers";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchTasks } from "@/lib/data";
import TasksProvider from "@/components/providers/TasksContext";
import ProjectEdit from "@/components/app/project-edit";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const allTasks = await fetchTasks();

    return (
        <Providers>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <TasksProvider tasks={allTasks}>
                        <div className="w-full">
                            <header className="p-3 flex justify-between items-center">
                                <div className="flex items-center gap-4 grow truncate">
                                    <SidebarTrigger />
                                    <AppTitle />
                                </div>
                                <ProjectSortingSelect />
                            </header>
                            <main className="p-3 m-auto">
                                <ActiveProjectUpdater />
                                {children}
                            </main>
                        </div>
                        <AddTask />
                        <ProjectEdit />
                    </TasksProvider>
                </SidebarInset>
            </SidebarProvider>
        </Providers>
    );
}
