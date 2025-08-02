"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext<string | undefined>(undefined);

export default function UserProvider({
    value,
    children
}: {
    value: string
    children: React.ReactNode
}) {
    const [ user, setUser ] = useState(value);

    return (
        <UserContext value={user}>
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