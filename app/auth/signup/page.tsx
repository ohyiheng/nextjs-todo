import LoginForm from "@/components/form-login"

export default function Page() {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoginForm signUp={true} />
        </div>
    )
}