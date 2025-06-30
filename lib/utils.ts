import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

export function partition<T>(array: T[], predicate: (x: T) => boolean) {
    let [pass, fail]: [T[], T[]] = [Array(), Array()];
    for (let item of array) {
        if (predicate(item)) {
            pass.push(item);
        } else {
            fail.push(item);
        }
    }
    return [pass, fail];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
