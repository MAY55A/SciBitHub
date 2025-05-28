import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { fetchLatestDiscussions } from "@/src/lib/fetch-data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { UserHoverCard } from "../custom/user-hover-card";

export default async function LatestDiscussions() {
  const discussions = await fetchLatestDiscussions();

  return (
    <section className="w-full flex flex-col items-center max-w-6xl px-4 py-20" id="latest-discussions">
      <h2 className="text-3xl font-semibold text-center mb-4">Latest Discussions</h2>
      <p className="text-center text-muted-foreground mb-6">
        See what's trending in the community
      </p>
      <Carousel className="w-full max-w-md lg:max-w-5xl md:max-w-2xl">
        <CarouselContent className="">
          {discussions.map((d) => (
            <CarouselItem key={d.id} className="basis-1/1 lg:basis-1/2 w-full">
              <Card className="">
                <CardContent className="p-6 h-44">
                  <h3 className="font-bold line-clamp-2 mb-2">{d.title}</h3>
                  <div className="text-sm text-muted-foreground line-clamp-3 pl-2 font-retro">
                    <div>By <UserHoverCard user={d.creator}/></div>
                    Tags: {d.tags?.join(', ')} sd d qdfsd fdfd dfqdsf sqd f qsdf qsdfqsd fsdf
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="default" size="sm" className="font-semibold"><Link href={`/discussions/${d.id}`}>Join Now</Link><ChevronRight size={14} /></Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
          <CarouselItem className="flex justify-center items-center basis-1/3 lg:basis-1/4">
            <Link href="/discussions" className="flex flex-wrap items-center gap-1 text-green underline text-sm font-retro">Browse all discussions <ChevronRight size={14} /></Link>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
