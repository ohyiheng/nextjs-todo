"use client";

import Sidebar, { SidebarLink, SidebarSearch } from "@/components/sidebar";
import Button from "@/components/button";
import { Box, Calendar, Hashtag, Plus, SidebarExpand, SunLight } from "iconoir-react";
import { useState } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [ collapsed, setCollapsed ] = useState(false);

    return (
        <div className={`
            flex min-h-screen
        `}>
            <Sidebar collapsed={collapsed}>
                <div className="space-y-2">
                    <Button width="full" color="primary">
                        <div className="flex gap-1 items-center justify-center">
                            <Plus />
                            Add task
                        </div>
                    </Button>
                    <SidebarSearch />
                </div>
                <nav id="main-nav">
                    <SidebarLink href="/app/inbox" title="Inbox" icon={<Box />} />
                    <SidebarLink href="/app/today" title="Today" icon={<SunLight />} />
                    <SidebarLink href="/app/upcoming" title="Upcoming" icon={<Calendar />} />
                    <SidebarLink href="/app/tags" title="Tags" icon={<Hashtag />} />
                </nav>
                <div>
                    <p className="text-sm text-neutral-600 font-medium px-3 py-1.5">Projects</p>
                    <nav id="project-nav">
                        <SidebarLink href="/app/project/1" title="Project 1" />
                        <SidebarLink href="/app/project/2" title="Project 2" />
                        <SidebarLink href="/app/project/3" title="Project 3" />
                        <SidebarLink href="/app/project/4" title="Project 4 with a very long name omg this is way too long"/>
                    </nav>
                </div>
            </Sidebar>
            <main className="grow bg-white">
                <Button width="icon" onClick={() => { setCollapsed(!collapsed) }}>
                    <SidebarExpand />
                </Button>
                {children}
            </main>
        </div>
    );
}
