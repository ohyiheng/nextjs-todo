import { fetchProjects } from "@/lib/data";
import { SidebarProvider } from "../ui/sidebar"
import { ProjectsProvider } from "./ProjectsProvider"
import TitleProvider from "./TitleProvider";
import { ActiveTaskProvider } from "./ActiveTaskContext";
import { SortingProvider } from "./SortingProvider";

export default async function Providers({
    children
}: {
    children: React.ReactNode
}) {
    const projects = await fetchProjects();

    return (
        <ProjectsProvider projects={projects}>
            <TitleProvider>
                <ActiveTaskProvider>
                    <SortingProvider>
                        {children}
                    </SortingProvider>
                </ActiveTaskProvider>
            </TitleProvider>
        </ProjectsProvider>
    )
}