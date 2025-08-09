import LoginForm from "@/components/app/form-login"
import { verifySessionCookies } from "@/lib/data-access-layer"
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await verifySessionCookies();
    if (session) redirect("/app/inbox");

    const demo = process.env.NEXT_PUBLIC_DEMO?.toLowerCase() === "true";

    return (
        <div className="flex justify-center items-center h-screen">
            <LoginForm demo={demo} />
        </div>
    )
}