'use client'

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Plus } from 'lucide-react';
import { PublicUser } from '@/src/types/models';
import { createClient } from '@/src/utils/supabase/client';
import { debounce } from '@/src/utils/utils';

type UserSearchProps = {
    onSelectUser: (user: PublicUser) => void;
};
const supabase = createClient();
export default function UserSearch({ onSelectUser }: UserSearchProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = debounce(async (searchTerm: string) => {
        if (!searchTerm) {
            setUsers([]);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase
            .from("users")
            .select("id, username, profile_picture, role")
            .eq("role", "contributor")
            .ilike("username", `%${searchTerm}%`)

        if (error) console.error("Error fetching users:", error);
        else setUsers(data || []);

        setLoading(false);
    }, 300);

    useEffect(() => {
        fetchUsers(value);
        return () => fetchUsers.cancel();
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between justify-self-end"
                >
                    {"Add contributor..."}
                    <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search contributor..."
                        value={value}
                        onValueChange={setValue}
                    />
                    <CommandList>
                        {loading ? (
                            <CommandEmpty>Loading...</CommandEmpty>
                        ) : users.length === 0 ? (
                            <CommandEmpty>No contributors found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {users.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={user.username}
                                        onSelect={() => {
                                            onSelectUser(user);
                                            setValue("");
                                            setOpen(false);
                                        }}
                                    >
                                        <Avatar className="relative flex shrink-0 overflow-hidden h-8 w-8 rounded-lg hover:shadow-lg">
                                            <AvatarImage src={user.profile_picture} alt={user.username} />
                                            <AvatarFallback className="rounded-lg">
                                                {user.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.username}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}