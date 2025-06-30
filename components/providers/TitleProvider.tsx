"use client";

import { createContext, Dispatch, useContext, useState } from "react";

type TitleContextType = {
    title: string,
    setTitle: Dispatch<string>
}

export const TitleContext = createContext<TitleContextType | undefined>(undefined);

export default function TitleProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [ title, setTitle ] = useState("");

    return (
        <TitleContext value={{ title, setTitle }}>
            {children}
        </TitleContext>
    )
}

export const useTitle = () => {
    const titleContext = useContext(TitleContext);
    if (!titleContext) {
        throw new Error("useTitle must be used within a TitleProvider");
    }
    return titleContext;
}
