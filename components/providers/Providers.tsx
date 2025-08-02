import { fetchProjects, fetchTags, fetchTasks } from "@/lib/data";
import { ProjectsProvider } from "./ProjectsProvider"
import TitleProvider from "./TitleProvider";
import { ActiveTaskProvider } from "./ActiveTaskContext";
import { Provider as JotaiProvider } from "jotai";
import { TagsProvider } from "./TagsProvider";
import { verifySessionCookies } from "@/lib/data-access-layer";
import UserProvider from "./UserProvider";
import TasksProvider from "./TasksContext";

export default async function Providers({
    children
}: {
    children: React.ReactNode
}) {
    const { username } = await verifySessionCookies();
    const tags = await fetchTags(username);
    const projects = await fetchProjects(username);
    const tasks = await fetchTasks(username);

    return (
        <UserProvider value={username}>
            <ProjectsProvider projects={projects}>
                <TagsProvider tags={tags}>
                    <TitleProvider>
                        <TasksProvider tasks={tasks}>
                            <ActiveTaskProvider>
                                <JotaiProvider>
                                    {children}
                                </JotaiProvider>
                            </ActiveTaskProvider>
                        </TasksProvider>
                    </TitleProvider>
                </TagsProvider>
            </ProjectsProvider>
        </UserProvider>
    )
}