import * as React from "react";
import { CheckIcon, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectProps<T, K = string> {
    options: T[];
    getLabel: (option: T) => string;
    getValue: (option: T) => K;
    onValueChange: (values: K[]) => void;
    placeholder: string;
    truncateCount: number;
    disabled: boolean;
    selectedValue: K[];
    setSelectedValue: React.Dispatch<K[]>;

    isPopoverOpen: boolean;
    setIsPopoverOpen: React.Dispatch<boolean>;
    onOptionSelect: (value: K) => void;
    onClearAllOptions: () => void;
}

export function MultiSelect<T, K = string>({
    options,
    value = [],
    onValueChange,
    getLabel,
    getValue,
    placeholder = "Select...",
    truncateCount = 3,
    disabled = false,
    className,
    children,
    ...restProps
}: {
    options: T[];
    value: K[];
    onValueChange: (values: K[]) => void;
    getLabel: (option: T) => string;
    getValue: (option: T) => K;
    placeholder?: string;
    truncateCount?: number;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children: (v: MultiSelectProps<T, K>) => React.ReactNode;
}) {
    const [ selectedValue, setSelectedValue ] = React.useState<K[]>(value);
    const [ isPopoverOpen, setIsPopoverOpen ] = React.useState(false);

    const onOptionSelect = (option: K) => {
        const newSelectedValues = selectedValue.includes(option)
            ? selectedValue.filter((value) => value !== option)
            : [ ...selectedValue, option ];
        setSelectedValue(newSelectedValues);
        onValueChange(newSelectedValues);
    };

    const onClearAllOptions = () => {
        setSelectedValue([]);
        onValueChange([]);
    };

    const toggleAll = () => {
        if (selectedValue.length === options.length) {
            onClearAllOptions();
        } else {
            const allValues = options.map((option) => getValue(option));
            setSelectedValue(allValues);
            onValueChange(allValues);
        }
    };

    React.useEffect(() => {
        if (isPopoverOpen && JSON.stringify(value) !== JSON.stringify(selectedValue)) {
            setSelectedValue(value);
        }
    }, [ isPopoverOpen ])

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                {children({
                    options,
                    onValueChange,
                    getLabel,
                    getValue,
                    placeholder,
                    truncateCount,
                    disabled,
                    selectedValue,
                    setSelectedValue,
                    isPopoverOpen,
                    setIsPopoverOpen,
                    onOptionSelect,
                    onClearAllOptions,
                })}
            </PopoverTrigger>
            <PopoverContent
                className={cn("w-auto p-0", className)}
                align="start"
                onEscapeKeyDown={() => setIsPopoverOpen(false)}
                {...restProps}
            >
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList className="max-h-[unset] overflow-y-hidden">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                                <div
                                    className={cn(
                                        "mr-1 flex h-4 w-4 items-center justify-center rounded-md border border-muted-foreground/50",
                                        selectedValue.length === options.length
                                            ? "bg-primary text-primary-foreground"
                                            : "opacity-50 [&_svg]:invisible",
                                    )}
                                >
                                    <CheckIcon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-muted-foreground">Select All</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup className="max-h-[20rem] min-h-[10rem] overflow-y-auto">
                            {options.map((option) => {
                                const isSelected = selectedValue.includes(getValue(option));
                                return (
                                    <CommandItem
                                        key={String(getValue(option))}
                                        onSelect={() => onOptionSelect(getValue(option))}
                                        className="cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                "mr-1 flex h-4 w-4 items-center justify-center rounded-md border border-muted-foreground/50",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <CheckIcon className="h-3.5 w-3.5" />
                                        </div>
                                        {/* {option.icon && <option.icon className="w-4 h-4 mr-2 text-muted-foreground" />} */}
                                        <span>{getLabel(option)}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                            <div className="flex items-center justify-between">
                                {selectedValue.length > 0 && (
                                    <>
                                        <CommandItem
                                            onSelect={onClearAllOptions}
                                            className="justify-center flex-1 cursor-pointer"
                                        >
                                            Clear
                                        </CommandItem>
                                        <Separator orientation="vertical" className="flex h-full min-h-6" />
                                    </>
                                )}
                                <CommandItem
                                    onSelect={() => setIsPopoverOpen(false)}
                                    className="justify-center flex-1 max-w-full cursor-pointer"
                                >
                                    Close
                                </CommandItem>
                            </div>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
MultiSelect.displayName = "MultiSelect";

export function MultiSelectTrigger<T, K = string>({
    options,
    // onValueChange,
    getLabel,
    getValue,
    placeholder,
    truncateCount,
    disabled,
    selectedValue,
    // setSelectedValue,
    isPopoverOpen,
    setIsPopoverOpen,
    onOptionSelect,
    onClearAllOptions,
    className,
    style,
    children,
    ref,
}: MultiSelectProps<T, K> & {
    className?: string;
    children?: (v: T) => React.ReactNode;
    style?: React.CSSProperties;
    ref?: React.Ref<HTMLButtonElement>
}) {
    const onTogglePopover = () => {
        setIsPopoverOpen(!isPopoverOpen);
    };

    return (
        <Button
            ref={ref}
            onClick={onTogglePopover}
            variant="outline"
            type="button"
            size="sm"
            disabled={disabled}
            className={cn(
                "flex h-auto min-h-10 w-full items-center justify-between px-1 py-0.5 [&_svg]:pointer-events-auto",
                "hover:bg-transparent",
                disabled && "[&_svg]:pointer-events-none",
                className,
            )}
            style={style}
        >
            {selectedValue.length > 0 ? (
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-wrap items-center px-1">
                        {selectedValue.slice(0, truncateCount).map((value, index) => {
                            const option = options.find((o) => getValue(o) === value);

                            if (!option) {
                                return <div key={`${index}-${value}`}></div>;
                            }

                            if (children) {
                                return <div key={`${index}-${value}`}>{children(option)}</div>;
                            }

                            return (
                                <Badge
                                    key={`${index}-${value}`}
                                    className={cn(
                                        "mr-1 cursor-default border-transparent bg-muted text-foreground hover:bg-muted",
                                    )}
                                >
                                    {/* {option?.icon && <option.icon className="mr-1 h-3.5 w-3.5" />} */}
                                    {option && getLabel(option)}
                                    <div role="button" tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOptionSelect(value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.stopPropagation();
                                                onOptionSelect(value);
                                            }
                                        }}
                                        className="ml-1 cursor-pointer">
                                        <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                    </div>
                                </Badge>
                            );
                        })}
                        {selectedValue.length > truncateCount && (
                            <div className={cn("cursor-default py-1 pl-1.5 text-muted-foreground")}>
                                {`+${selectedValue.length - truncateCount}`}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <X
                            className="h-4 mx-2 cursor-pointer text-muted-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClearAllOptions();
                            }}
                        />
                        <Separator orientation="vertical" className="flex h-full min-h-6" />
                        <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between w-full mx-auto">
                    <span className="mx-3 text-sm text-muted-foreground">{placeholder}</span>
                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                </div>
            )}
        </Button>
    );
}
MultiSelectTrigger.displayName = "MultiSelectTrigger";