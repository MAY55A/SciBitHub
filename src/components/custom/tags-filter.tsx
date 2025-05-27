'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Filter, Plus } from "lucide-react";
import { Badge } from "../ui/badge";

export function TagsFilter({ allTags }: { allTags: string[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const currentTags = params.get('tags')?.split(',') || [];
    const [selectedTags, setSelectedTags] = useState<string[]>(currentTags);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const applyFilter = (tags: string[]) => {
        params.set('page', '1');
        if (tags && tags.length > 0) {
            params.set('tags', tags.join(','));
        } else {
            params.delete('tags');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onSelectTag = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        };
    }

    const removeTag = (tag: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    }

    const clearAll = () => {
        applyFilter([]);
        setSelectedTags([]);
    };

    return (
        <div className="w-full flex flex-wrap items-center justify-between gap-4 border p-8 my-8 rounded-2xl" title="Filter by tags">
            <Filter className="text-primary" size={18}/>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="secondary"
                        role="combobox"
                        size="sm"
                        aria-expanded={open}
                        className=" justify-between rounded-full"
                    >
                        {"Add Tag"}
                        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 font-retro">
                    <Command>
                        <CommandInput
                            placeholder="Start typing to search..."
                            value={value}
                            onValueChange={(val) => setValue(val.toLowerCase())}
                        />
                        <CommandList>
                            {value.length > 2 &&
                                <>
                                    <CommandEmpty>No tags found.</CommandEmpty>
                                    <CommandGroup>
                                        {allTags.filter(t => t.toLowerCase().includes(value)).map((tag) => (
                                            <CommandItem
                                                key={tag}
                                                value={tag}
                                                onSelect={() => {
                                                    onSelectTag(tag);
                                                    setValue("");
                                                    setOpen(false);
                                                }}
                                            >
                                                {tag}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            }
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="flex-1 flex flex-wrap gap-2 font-retro">
                {selectedTags.length ?
                    selectedTags.map((tag) => (
                        <Badge
                            variant="outline"
                            key={tag}
                            className="rounded-fully p-2 font-semibold border border-primary text-muted-foreground hover:text-primary"
                        >
                            {tag}
                            <Button variant="ghost" size="sm" onClick={() => removeTag(tag)} className="text-xs hover:text-destructive w-4 h-4 ml-2 ">
                                ✕
                            </Button>
                        </Badge>

                    )) :
                    <span className="text-muted-foreground text-sm">Select tags to filter with</span>
                }
            </div>

            <div>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => applyFilter(selectedTags)}
                        className="text-xs ml-2 rounded-xl"
                        disabled={!selectedTags.length}
                    >
                        Apply Filter
                    </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs ml-2 rounded-xl"
                    disabled={!currentTags.length}
                >
                    Clear Filter
                </Button>
            </div>
        </div>
    )
}