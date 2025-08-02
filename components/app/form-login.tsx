"use client";

import { logIn, signUp, LoginFormState } from "@/lib/auth";
import clsx from "clsx";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginForm({ signingUp }: { signingUp?: boolean }) {
    const initialLoginFormState: LoginFormState = {
        message: null,
    }
    const [ formState, formAction ] = useActionState(signingUp ? signUp : logIn, initialLoginFormState);

    return (
        <form action={formAction}
            aria-describedby="form-errors"
            className="
            w-4/5 md:w-[400px]
            p-6 space-y-5
            bg-white dark:bg-zinc-900
            border border-zinc-200 dark:border-zinc-700
            shadow-xs rounded-xl
        ">
            <h2 className="text-xl font-bold">
                {signingUp ? "Sign up for a new account" : "Log in to your account"}
            </h2>
            <div className="space-y-2.5">
                <label htmlFor="username" className={clsx(
                    "block text-sm font-semibold",
                    { "text-red-600": formState.errors?.username },
                )}>
                    Username
                </label>
                <input type="text" name="username" placeholder="johndoe"
                    defaultValue={formState.fieldValue?.username ?? ""}
                    aria-describedby="username-errors"
                    className={clsx(
                        "block w-full px-3 py-1.5",
                        "bg-white dark:bg-zinc-800",
                        "border border-zinc-200 dark:border-zinc-700",
                        { "border-red-600": formState.errors?.username },
                        "shadow-xs rounded-lg"
                    )}
                />
                <div id="username-errors" aria-live="polite" aria-atomic="true">
                    {formState.errors?.username?.errors?.map(errMsg => (
                        <p key={errMsg} className="text-sm text-red-600 dark:text-red-400">
                            {errMsg}
                        </p>
                    ))}
                </div>
            </div>
            <div className="space-y-2.5">
                <label htmlFor="password" className={clsx(
                    "block text-sm font-semibold",
                    { "text-red-600": formState.errors?.password },
                )}>
                    Password
                </label>
                <input type="password" name="password" placeholder="********"
                    aria-describedby="password-errors"
                    className={clsx(
                        "block w-full px-3 py-1.5",
                        "bg-white dark:bg-zinc-800",
                        "border border-zinc-200 dark:border-zinc-700",
                        { "border-red-600": formState.errors?.password },
                        "shadow-xs rounded-lg"
                    )}
                />
                <div id="password-errors" aria-live="polite" aria-atomic="true">
                    {formState.errors?.password?.errors?.map(errMsg => (
                        <p key={errMsg} className="text-sm text-red-600 dark:text-red-400">
                            {errMsg}
                        </p>
                    ))}
                </div>
            </div>
            <div className="w-full flex flex-col gap-2">
                <p id="form-errors" aria-live="polite" aria-atomic="true"
                    className="text-sm text-red-600 dark:text-red-400">
                    {formState.message}
                </p>
                <button type="submit" className={`
                    w-full px-3 py-1.5
                    bg-sky-700 dark:bg-sky-400
                    hover:bg-sky-800 dark:hover:bg-sky-500
                    text-zinc-50 dark:text-zinc-900 
                    font-medium rounded-lg cursor-pointer
                    duration-100 ease-in-out
                    `}
                >
                    Submit
                </button>
                <p className="self-center text-sm">
                    {signingUp ? "Already have an account? " : "Don't have an account? "}
                    <Link href={signingUp ? "/auth/login" : "/auth/signup"}
                        className="underline hover:text-sky-800">
                        {signingUp ? "Log in" : "Sign up"}
                    </Link>
                </p>
            </div>
        </form>
    )
}