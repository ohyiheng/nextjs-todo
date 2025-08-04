import LoginForm from "@/components/app/form-login"
import { verifySessionCookies } from "@/lib/data-access-layer"
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await verifySessionCookies();
    if (session) redirect("/app/inbox");

    return (
        <div className="flex justify-center items-center h-screen">
            <LoginForm />
        </div>
    )
}