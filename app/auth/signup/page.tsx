import LoginForm from "@/components/app/form-login"

export default function Page() {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoginForm signUp={true} />
        </div>
    )
}