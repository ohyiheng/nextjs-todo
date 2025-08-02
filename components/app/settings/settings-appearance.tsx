import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Check } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsAppearance() {
    const { theme, themes, setTheme } = useTheme();

    return (
        <div className="flex justify-between items-center">
            App theme
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
                        <Moon className="h-[1.2rem] w-[1.2rem] hidden transition-all dark:block" />
                        <span>{theme && theme[ 0 ].toUpperCase() + theme.substring(1)}</span>
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {themes.map(t => (
                        <DropdownMenuItem key={t} className="flex items-center justify-between"
                            onClick={() => setTheme(t)}>
                            {t[ 0 ].toUpperCase() + t.substring(1)} <Check className={`${theme !== t && "hidden"}`} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}