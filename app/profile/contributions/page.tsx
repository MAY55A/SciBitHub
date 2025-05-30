import ContributionCard from "@/src/components/contributions/contribution-card";
import { ContributionMap } from "@/src/components/contributions/contributions-timeline";
import Pagination from "@/src/components/custom/pagination";
import { fetchContributions, fetchContributionsPerDay } from "@/src/lib/fetch-data";
import { createClient } from "@/src/utils/supabase/server";


export default async function Page(props: {
    searchParams?: Promise<{
        page?: string;
    }>
}) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return <p>You are not authenticated</p>;
    }

    const currentPage = Number((await props.searchParams)?.page) || 1;
    const data = await fetchContributionsPerDay(user.data.user!.id);
    const { contributions, totalPages } = await fetchContributions(undefined, user.data.user!.id, currentPage, 3);

    return (
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 p-4">
            <div className="col-span-2 space-y-4">
                <h2 className="text-lg font-bold">My Contributions</h2>
                <div>{contributions
                    ? <div className="flex flex-col gap-4 w-full">
                        {contributions.map(contribution => (
                            <ContributionCard key={contribution.id} contribution={contribution} />
                        ))}
                        <div className="mt-5 flex w-full justify-center">
                            {totalPages ? <Pagination totalPages={totalPages} /> : undefined}
                        </div>
                    </div>
                    : <p className="flex items-center justify-center text-muted-foreground h-80 border font-retro">
                        You have no contributions yet.
                    </p>
                }</div>
            </div>
            <div className="">
                {data
                    ? <ContributionMap {...data} />
                    : <p className="flex items-center justify-center text-muted-foreground h-80 border font-retro p-8 text-center">
                        Contributions map not available. Please try again later.
                    </p>
                }
            </div>
        </div>

    );
}


