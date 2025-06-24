import AppLayout from "@/components/app";
import { fetchProjects } from "@/lib/data";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const projects = await fetchProjects();

    return (
        <AppLayout projects={projects}>
            {children}
        </AppLayout>
    );
}
