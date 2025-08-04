"use client";

import { createContext, useContext } from "react";

const UserContext = createContext<string | undefined>(undefined);

export default function UserProvider({
    value,
    children
}: {
    value: string
    children: React.ReactNode
}) {
    return (
        <UserContext value={value}>
            {children}
        </UserContext>
    )
}

export const useUser = () => {
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("useUser() must be used within a UserProvider");
    }
    return userContext;
}