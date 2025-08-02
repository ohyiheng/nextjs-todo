// https://lucia-auth.com/sessions/basic

import sql from "@/lib/db";
import { hashSecret } from "@/lib/utils";

export interface Session {
    id: string,
    secretHash: Uint8Array,
    createdAt: Date,
    username: string,
}

export interface SessionWithToken extends Session {
    token: string,
}

const sessionTimeoutInSeconds = 60 * 60 * 24; // Session expires after 1 day

/**
 * Generates random bytes encoded in a string format similar to base32.
 */
function generateSecureRandomString(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);

    let result = "";
    for (let i = 0; i < bytes.length; i++) {
        result += characters[ bytes[ i ] >> 3 ];
    }
    return result;
}

export async function createSession(username: string): Promise<SessionWithToken> {
    const id = generateSecureRandomString();
    const secret = generateSecureRandomString();
    const secretHash = await hashSecret(secret);

    const newSession: SessionWithToken = {
        id: id,
        secretHash: secretHash,
        createdAt: new Date(),
        username: username,
        token: id + "." + secret,
    }

    await sql`INSERT INTO sessions VALUES(
        ${newSession.id}, 
        ${newSession.secretHash}, 
        ${Math.floor(newSession.createdAt.getTime() / 1000)},
        ${username})`;

    console.log("Session created");

    return newSession;
}

export async function getSessionFromDb(sessionId: string): Promise<Session | null> {
    const queryResult = await sql`SELECT * FROM sessions WHERE id = ${sessionId}`;
    if (queryResult.length == 0) {
        return null;
    }
    const session: Session = {
        id: queryResult[ 0 ].id,
        secretHash: queryResult[ 0 ].secretHash,
        createdAt: new Date(queryResult[ 0 ].createdAt * 1000),
        username: queryResult[ 0 ].username
    }
    console.log(session);

    // If expired
    if ((Date.now() - session.createdAt.getTime()) >= sessionTimeoutInSeconds * 1000) {
        await deleteSession(sessionId);
        return null;
    }

    return session;
}

export async function deleteSession(sessionId: string) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}


