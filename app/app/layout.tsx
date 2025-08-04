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
import MainMoreOptions from "@/components/app/main-more-options";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <Providers>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="max-w-full">
                    <div className="w-full max-w-full h-full flex flex-col">
                        <header className="p-3 min-h-16 max-w-full flex justify-between items-center gap-3">
                            <SidebarTrigger />
                            <AppTitle />
                            <div className="flex items-center gap-2">
                                <MainMoreOptions />
                                <ProjectSortingSelect />
                            </div>
                        </header>
                        <main className="p-3 m-auto w-full grow">
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
