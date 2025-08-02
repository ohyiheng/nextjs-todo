import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useRef, useState } from "react";
import useTags from "../../providers/TagsProvider";
import { TagSchema } from "@/lib/definitions";
import { addTag } from "@/lib/actions";
import { useUser } from "@/components/providers/UserProvider";

export default function TagAdd({
    children
}: {
    children: React.ReactNode
}) {
    const { tags, setTags } = useTags();
    const [ tagInput, setTagInput ] = useState("");
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);
    const user = useUser();

    async function handleSubmit() {
        const result = TagSchema.safeParse(tagInput);

        if (!result.success) {
            setError(true);
        } else {
            setError(false);
            if (!tags.includes(result.data)) {
                setTags([ ...tags, result.data ]);
                setTagInput("");
                setOpen(false);
                await addTag(result.data, user);
            }
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        {children}
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Add tags</TooltipContent>
            </Tooltip>
            <PopoverContent side="right" className="w-[200px] p-2">
                <Input placeholder="New tag" value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            ref.current?.click()
                        }
                    }}
                    aria-invalid={error}
                />
                {error && <p className="text-sm text-destructive">Invalid tag format</p>}
                <Button size="sm" className="mt-2 w-full"
                    onClick={handleSubmit}
                    ref={ref}
                >
                    Add tag
                </Button>
            </PopoverContent>
        </Popover>
    )
}