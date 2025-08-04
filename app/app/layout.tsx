import ActiveItemUpdater from "@/components/app/active-item-updater";
import AddTask from "@/components/app/task/task-add";
import { AppSidebar } from "@/components/app/app-sidebar";
import AppTitle from "@/components/app/app-title";
import ProjectSortingSelect from "@/components/app/project/project-sorting-select";
import Providers from "@/components/providers/Providers";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProjectEdit from "@/components/app/project/project-edit";
import ProjectAdd from "@/components/app/project/project-add";
import TagEdit from "@/components/app/tag/tag-edit";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <Providers>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="w-full">
                        <header className="p-3 flex justify-between items-center">
                            <div className="flex items-center gap-4 grow truncate">
                                <SidebarTrigger />
                                <AppTitle />
                            </div>
                            <ProjectSortingSelect />
                        </header>
                        <main className="p-3 m-auto">
                            <ActiveItemUpdater />
                            {children}
                        </main>
                    </div>
                    <AddTask />
                    <ProjectEdit />
                    <ProjectAdd />
                    <TagEdit />
                </SidebarInset>
            </SidebarProvider>
        </Providers>
    );
}
