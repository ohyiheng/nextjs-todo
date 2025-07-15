import { fetchProjects } from "@/lib/data";
import { ProjectsProvider } from "./ProjectsProvider"
import TitleProvider from "./TitleProvider";
import { ActiveTaskProvider } from "./ActiveTaskContext";
import { Provider as JotaiProvider } from "jotai";

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
                    <JotaiProvider>
                        {children}
                    </JotaiProvider>
                </ActiveTaskProvider>
            </TitleProvider>
        </ProjectsProvider>
    )
}