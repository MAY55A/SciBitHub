import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { ProjectCard } from "../projects/project-card";
import { fetchLatestProjects } from "@/src/lib/fetch-data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function LatestProjects() {
  const projects = await fetchLatestProjects();

  return (
    <section className="w-full flex flex-col items-center max-w-6xl px-4 py-20" id="latest-projects">
      <h2 className="text-3xl font-semibold text-center mb-4">Recent Projects</h2>
      <p className="text-center text-muted-foreground mb-6">
        Browse some of our latest community projects
      </p>
      <Carousel className="w-full max-w-md lg:max-w-5xl md:max-w-2xl">
        <CarouselContent>
          {projects.map((p) => (
            <CarouselItem key={p.id} className="basis-1/1 lg:basis-1/2 w-full">
              <ProjectCard project={p} />
            </CarouselItem>
          ))}
          <CarouselItem className="flex justify-center items-center basis-1/3 lg:basis-1/5">
            <Link href="/projects" className="flex flex-wrap items-center gap-1 text-green underline text-sm font-retro">Browse all projects <ChevronRight size={14}/></Link>
            </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
