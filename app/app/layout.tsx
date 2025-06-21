import AppSidebar from "@/components/sidebar";
import { fetchProjects } from "@/lib/data";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const projects = await fetchProjects();

    return (
        <AppSidebar projects={projects}>
            {children}
        </AppSidebar>
    );
}
