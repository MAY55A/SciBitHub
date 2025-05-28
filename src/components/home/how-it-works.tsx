import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="w-full max-w-6xl px-4 py-20" id="how-it-works">
      <h2 className="text-3xl font-semibold text-center mb-4">How It Works</h2>
      <p className="text-center text-muted-foreground mb-6">
        Discover key services offered by SciBitHub.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Explore Research Projects</h3>
            <p className="text-sm text-muted-foreground font-retro mb-4">
              Browse through ongoing research projects across various domains. See project goals, data sources, and contribution needs.
            </p>
            <Button variant="outline" className="flex gap-1"><Link href={'/projects'}>Browse Projects</Link><ChevronRight size={14} /></Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Join as a Contributor</h3>
            <p className="text-sm text-muted-foreground font-retro mb-4">
              Participate in projects by contributing insights and analyzing data. No special background required — just curiosity and interest.
            </p>
            <Button variant="outline" className="flex gap-1"><Link href={'/projects'}>Contribute to Projects</Link><ChevronRight size={14} /></Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Start Your Own Project</h3>
            <p className="text-sm text-muted-foreground font-retro mb-4">
              Got a research idea? Create your own project as a casual researcher, academic, or organization. Provide context and data, define tasks, and invite the community to help.
            </p>
            <Button variant="outline" className="flex gap-1"><Link href={'/projects/create'}>Start a Project</Link><ChevronRight size={14} /></Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Discuss & Collaborate</h3>
            <p className="text-sm text-muted-foreground font-retro mb-4">
              Use built-in discussion boards to ask questions, share discoveries, or give feedback — structured by category and tags.
            </p>
            <Button variant="outline" className="flex gap-1"><Link href={'/discussions'}>Browse Discussions</Link><ChevronRight size={14} /></Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
