import AppBreadcrumb from "@/components/app/app-breadcrumb";
import { AppSidebar } from "@/components/app/app-sidebar";
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
                        <header className="p-3 flex items-center gap-4">
                            <SidebarTrigger />
                            <AppBreadcrumb />
                        </header>
                        <main className="p-3 m-auto">{children}</main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </Providers>
    );
}
