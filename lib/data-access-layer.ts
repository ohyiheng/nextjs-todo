import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import * as argon2 from "argon2";
import { getSessionFromDb, Session } from "@/lib/session";
import { hashSecret, compareHashConstantTime } from "@/lib/utils";
import sql from "@/lib/db";

interface User {
    username: string,
    passwordHash: string,
    email: string | null,
}

export async function getUserInfo(username: string): Promise<User | null> {
    try {
        const queryResult: {
            username: string,
            passwordHash: string,
            email: string | null
        }[] = await sql`SELECT * FROM users WHERE username = ${username}`;
        if (queryResult.length == 0) {
            return null;
        }
        return {
            username: queryResult[ 0 ].username,
            passwordHash: queryResult[ 0 ].passwordHash,
            email: queryResult[ 0 ].email,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
    const userInfo = await getUserInfo(username);
    if (!userInfo) {
        return false;
    }

    try {
        if (await argon2.verify(userInfo.passwordHash, password)) {
            return true;
        }
    } catch (error) {
        console.log(error)
    }

    return false;
}

export const verifySessionCookies = cache(async () => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
        return null;
    }

    const session = await validateSession(sessionToken);

    return session;
})

async function validateSession(token: string): Promise<Session | null> {
    const tokenParts = token.split('.');
    if (tokenParts.length != 2) {
        return null;
    }

    const tokenSessionId = tokenParts[ 0 ];
    const tokenSessionSecret = tokenParts[ 1 ];

    const dbSession = await getSessionFromDb(tokenSessionId);
    if (!dbSession) {
        return null;
    }
    const tokenSecretHash = await hashSecret(tokenSessionSecret);
    const sessionIsValid = compareHashConstantTime(tokenSecretHash, dbSession.secretHash);
    if (!sessionIsValid) {
        return null;
    }
    return dbSession;
}