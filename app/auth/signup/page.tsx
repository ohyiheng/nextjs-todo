import LoginForm from "@/components/app/form-login"
import { redirect } from "next/navigation";

export default function Page() {
    const demo = process.env.NEXT_PUBLIC_DEMO?.toLowerCase() === "true";
    if (demo) redirect("/auth/login");

    return (
        <div className="flex justify-center items-center h-screen">
            <LoginForm signingUp={true} />
        </div>
    )
}