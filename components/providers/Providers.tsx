import { fetchProjects, fetchTags } from "@/lib/data";
import { ProjectsProvider } from "./ProjectsProvider"
import TitleProvider from "./TitleProvider";
import { ActiveTaskProvider } from "./ActiveTaskContext";
import { Provider as JotaiProvider } from "jotai";
import { TagsProvider } from "./TagsProvider";
import { getSessionFromDb } from "@/lib/session";
import { verifySessionCookies } from "@/lib/data-access-layer";
import UserProvider from "./UserProvider";

export default async function Providers({
    children
}: {
    children: React.ReactNode
}) {
    const projects = await fetchProjects();
    const tags = await fetchTags();
    const { username } = await verifySessionCookies();

    return (
        <UserProvider value={username}>
            <ProjectsProvider projects={projects}>
                <TagsProvider tags={tags}>
                    <TitleProvider>
                        <ActiveTaskProvider>
                            <JotaiProvider>
                                {children}
                            </JotaiProvider>
                        </ActiveTaskProvider>
                    </TitleProvider>
                </TagsProvider>
            </ProjectsProvider>
        </UserProvider>
    )
}