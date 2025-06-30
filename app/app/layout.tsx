import AppBreadcrumb from "@/components/app/app-breadcrumb";
import { AppSidebar } from "@/components/app/app-sidebar";
import Providers from "@/components/providers/Providers";
export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <AppSidebar />
            <div className="w-full">
                <header className="p-3">
                    <AppBreadcrumb />
                </header>
                <main className="p-3">{children}</main>
            </div>
        </Providers>
    );
}
