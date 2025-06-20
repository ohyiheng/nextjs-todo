export async function hashSecret(secret: string): Promise<Uint8Array> {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return new Uint8Array(secretHashBuffer);
}

export function compareHashConstantTime(a: Uint8Array, b: Uint8Array) {
    if (a.length != b.length) {
        return false;
    }
    let c = 0;
    for (let i = 0; i < a.length; i++) {
        c |= a[ i ] ^ b[ i ];
    }
    return c === 0;
}