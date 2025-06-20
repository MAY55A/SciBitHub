import { useState } from "react"
import UserSearch from "./user-search";
import { PublicUser } from "@/src/types/models";

export default function ContributorsInput({ value, onChange, existingUsers = [], showMessage }: { value?: PublicUser[], onChange: (contributors: PublicUser[]) => void, existingUsers?: PublicUser[], showMessage?: (message: string) => void }) {
    const [contributors, setContributors] = useState<PublicUser[]>(value ?? []);

    function handleSelection(user: PublicUser) {
        if (existingUsers.find(u => u.id === user.id)) {
            showMessage?.("A request for this user was already made.");
            return;
        }
        if (contributors.find(u => u.id === user.id)) {
            showMessage?.("User already added to the invited list.");
            return;
        }
        const newContributors = [...contributors, user];
        setContributors(newContributors);
        onChange(newContributors);
        showMessage?.("");
    }

    function removeContributor(index: number) {
        const newContributors = contributors.filter((_, i) => i !== index);
        setContributors(newContributors);
        onChange(newContributors);
    }

    return (
        <div className="relative flex justify-between border border-input rounded-md p-1 gap-2">
            <div className="relative flex flex-wrap gap-2 font-retro">
                {contributors.map((user, index) => (
                    <div className="bg-muted rounded-3xl py-2 px-3" key={index}>
                        <span className="text-sm">{user.username}</span>
                        <span className="inline-flex justify-center items-center h-4 w-4 rounded-full text-red-400 hover:text-red-500 cursor-pointer ml-2" onClick={() => removeContributor(index)}>&times;</span>
                    </div>
                ))}
            </div>
            <UserSearch onSelectUser={handleSelection} />
        </div>
    )
}