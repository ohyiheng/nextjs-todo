"use client";

import { logIn, signUp as sU, LoginFormState } from "@/lib/auth";
import clsx from "clsx";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginForm({ signUp }: { signUp?: boolean }) {
    const initialLoginFormState: LoginFormState = {
        message: null,
    }
    const [ formState, formAction ] = useActionState(signUp ? sU : logIn, initialLoginFormState);

    return (
        <form action={formAction}
            aria-describedby="form-errors"
            className="
            w-4/5 md:w-[400px]
            p-6 space-y-5
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-700
            shadow-xs rounded-xl
        ">
            <h2 className="text-xl font-bold">
                {signUp ? "Sign up for a new account" : "Log in to your account"}
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
                        "bg-white dark:bg-neutral-800",
                        "border border-neutral-200 dark:border-neutral-700",
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
                        "bg-white dark:bg-neutral-800",
                        "border border-neutral-200 dark:border-neutral-700",
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
                    text-neutral-50 dark:text-neutral-900 
                    font-medium rounded-lg cursor-pointer
                    duration-100 ease-in-out
                    `}
                >
                    Submit
                </button>
                <p className="self-center text-sm">
                    {signUp ? "Already have an account? " : "Don't have an account? "}
                    <Link href={signUp ? "/auth/login" : "/auth/signup"}
                        className="underline hover:text-sky-800">
                        {signUp ? "Log in" : "Sign up"}
                    </Link>
                </p>
            </div>
        </form>
    )
}