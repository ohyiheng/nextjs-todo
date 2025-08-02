"use client"

import * as React from "react"
import {
    Paintbrush,
    Settings,
    User,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"
import SettingsAppearance from "./settings-appearance"
import SettingsUser from "./settings-user"
import { useIsMobile } from "@/hooks/use-mobile"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const data = {
    nav: [
        { name: "Appearance", icon: Paintbrush, content: <SettingsAppearance/> },
        { name: "User", icon: User, content: <SettingsUser/> },
    ],
}

export function AppSettings() {
    const [ open, setOpen ] = React.useState(false);
    const [ activeSettings, setActiveSettings ] = React.useState(data.nav[ 0 ].name);
    const isMobile = useIsMobile();

    if (isMobile) return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <SidebarMenuButton> <Settings /> Options </SidebarMenuButton>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Settings</DrawerTitle>
                    <DrawerDescription className="sr-only">
                        Customize your settings here.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                <Accordion type="single" collapsible defaultValue={activeSettings}>
                    {data.nav.map(item => (
                        <AccordionItem key={item.name} value={item.name}>
                            <AccordionTrigger>{item.name}</AccordionTrigger>
                            <AccordionContent>{item.content}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton> <Settings /> Options </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
                <DialogTitle className="sr-only">Settings</DialogTitle>
                <DialogDescription className="sr-only">
                    Customize your settings here.
                </DialogDescription>
                <SidebarProvider className="items-start">
                    <Sidebar collapsible="none" className="hidden md:flex">
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {data.nav.map((item) => (
                                            <SidebarMenuItem key={item.name}>
                                                <SidebarMenuButton
                                                    isActive={item.name === activeSettings}
                                                    onClick={() => setActiveSettings(item.name)}
                                                >
                                                    <item.icon />
                                                    <span>{item.name}</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
                    <main className="px-4 flex h-[480px] flex-1 flex-col overflow-hidden">
                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2">
                                <h2>{activeSettings}</h2>
                            </div>
                        </header>
                        <div className="text-sm">
                            {data.nav.find(item => item.name === activeSettings)?.content}
                        </div>
                    </main>
                </SidebarProvider>
            </DialogContent>
        </Dialog>
    )
}
