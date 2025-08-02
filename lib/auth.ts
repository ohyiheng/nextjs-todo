"use server";

import { cookies } from "next/headers";
import { z } from "zod/v4";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as argon2 from "argon2";
import { createSession, deleteSession } from "@/lib/session";
import sql from "@/lib/db";
import { getUserInfo, verifyCredentials, verifySessionCookies } from "./data-access-layer";

export type LoginFormState = {
    errors?: {
        username?: {
            errors?: string[]
        },
        password?: {
            errors?: string[]
        },
    },
    fieldValue?: {
        username: string
    },
    message?: string | null,
}

const LoginFormSchema = z.object({
    username: z.string()
        .min(2, "Username must have at least 2 characters")
        .max(120, "Username cannot exceed 120 characters"),
    password: z.string()
        .min(6, "Password must have at least 6 characters"),
})

export async function logIn(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const validatedFields = LoginFormSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password")
    });

    if (!validatedFields.success) {
        return {
            fieldValue: {
                username: formData.get("username")?.toString() ?? ""
            },
            message: "Invalid credentials"
        };
    }

    const { username, password } = validatedFields.data;
    if (await verifyCredentials(username, password)) {
        const newSession = await createSession(username);
        await setSessionCookies(newSession.token);
        revalidatePath("/app", "layout")
        redirect("/app/inbox");
    }

    return {
        fieldValue: {
            username: formData.get("username")?.toString() ?? ""
        },
        message: "Invalid credentials"
    };
}

export async function signUp(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const validatedFields = LoginFormSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password")
    });

    if (!validatedFields.success) {
        // If validation fails, return the error message and the username input
        return {
            errors: z.treeifyError(validatedFields.error).properties,
            fieldValue: {
                username: formData.get("username")?.toString() ?? ""
            }
        }
    }

    const { username, password } = validatedFields.data;
    if (await getUserInfo(username) != null) {
        return {
            message: "User already exists"
        }
    }
    const newSession = await createUser(username, password);
    if (!newSession) {
        return {
            message: "Error occurred while creating new user"
        }
    }

    await setSessionCookies(newSession.token);
    revalidatePath("/app", "layout")
    redirect("/app/inbox");
}

export async function logOut() {
    const { id } = await verifySessionCookies();

    (await cookies()).delete("session_token");
    await deleteSession(id);
}

async function createUser(username: string, password: string) {
    try {
        const passwordHash = await argon2.hash(password);
        await sql.begin(async () => {
            await sql`INSERT INTO users VALUES(${username}, ${passwordHash})`;
            await sql`INSERT INTO projects (name, is_inbox, owner) VALUES ('Inbox', true, ${username})`;
        })
        return await createSession(username);
    } catch (error) {
        console.log(error);
        return null;
    }
}


async function setSessionCookies(sessionToken: string) {
    const cookieStore = await cookies();

    cookieStore.set("session_token", sessionToken, {
        maxAge: 86400,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
    });
}

export async function deleteUser(username: string) {
    (await cookies()).delete("session_token");
    await sql`DELETE FROM users WHERE username = ${username}`;
}
