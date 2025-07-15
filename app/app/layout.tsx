import ActiveProjectUpdater from "@/components/app/active-project-updater";
import { AppSidebar } from "@/components/app/app-sidebar";
import AppTitle from "@/components/app/app-title";
import ProjectSortingSelect from "@/components/app/project-sorting-select";
import Providers from "@/components/providers/Providers";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({
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
                            <div className="flex items-center gap-4">
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
                </SidebarInset>
            </SidebarProvider>
        </Providers>
    );
}
