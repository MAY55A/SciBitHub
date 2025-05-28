'use client';

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="max-w-7xl px-4 py-12 text-foreground">
            <motion.h1
                className="text-3xl lg:text-4xl font-bold text-primary mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                About SciBitHub
            </motion.h1>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-8">
                    <Section
                        title="What is SciBitHub?"
                        content="SciBitHub is a citizen science platform that empowers individuals and communities to participate in scientific exploration. Whether you're a casual science enthusiast or a professional researcher, you can create projects, contribute to ongoing work, or engage in open scientific discussions."
                    />

                    <Section
                        title="Why use it?"
                        content="SciBitHub focuses on inclusivity, openness, and debate. Unlike other platforms, it puts community interaction and discussion at the core of research — allowing users not only to contribute data but to exchange ideas and challenge assumptions."
                    />

                    <Section
                        title="Who is it for?"
                        content={
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Curious minds who want to explore real science</li>
                                <li>Academic researchers seeking broader participation</li>
                                <li>Organizations running open, transparent research</li>
                                <li>Anyone with an idea worth testing</li>
                            </ul>
                        }
                    />

                    <Section
                        title="How does it work?"
                        content="Users can browse public projects, join as contributors, or create their own research spaces. Tasks may include surveys, labeling, or data uploads. Each project comes with built-in tools for discussion, moderation, result sharing, and visualization."
                    />

                    <Section
                        title="About the Developer"
                        content={<div className="flex gap-2">
                            <p>
                                SciBitHub was built by a solo developer as part of an engineering thesis — blending technology and curiosity into a collaborative science platform. It's a project born out of passion for learning, sharing, and open access.
                            </p>
                            <a
                                href="https://may55a.github.io/Social-links-profile/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-center font-semibold text-green hover:underline"
                            >
                                <Image
                                    src="/images/developer-avatar.jpeg"
                                    alt="Developer Avatar"
                                    width={50}
                                    height={50}
                                    className="w-52 rounded-xl border border-border hover:scale-105 transition-transform"
                                />
                                MAY55A
                            </a>
                        </div>}
                    />

                </div>
                <div className="flex flex-col gap-8">
                    <Section
                        classname="lg:col-start-3 lg:row-start-2 lg:row-span-2"
                        title="FAQ"
                        content={
                            <Accordion type="multiple" className="w-full space-y-4">
                                <AccordionItem value="faq1">
                                    <AccordionTrigger>Why another citizen science platform?</AccordionTrigger>
                                    <AccordionContent>SciBitHub promotes open dialogue and inclusive participation — not just data collection.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="faq2">
                                    <AccordionTrigger>What kind of projects can I create?</AccordionTrigger>
                                    <AccordionContent>Any research project that can benefit from community contributions, such as data collection, analysis, or survey.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="faq3">
                                    <AccordionTrigger>How do I join a project?</AccordionTrigger>
                                    <AccordionContent>Simply browse the projects section, find one that interests you, pick one of the available tasks and then fill the form provided.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="faq4">
                                    <AccordionTrigger>Can I create private projects?</AccordionTrigger>
                                    <AccordionContent>Although all projects are visible to the public, you can choose to hide the results or allow only selected contributors with invite-based access.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="faq5">
                                    <AccordionTrigger>Who moderates the discussions?</AccordionTrigger>
                                    <AccordionContent>Users have the ability to report any type of content, and admins handle these reports and moderate the website.</AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        }
                    />
                    <RotatingQuotesBanner />
                    <Section
                        content={
                            <p>
                                Curious how we handle your data and protect your rights? Read our {" "}
                                <a href="/terms-of-service" className="font-semibold text-green hover:underline">Terms of Service</a> and  {" "}
                                <a href="/privacy" className="font-semibold text-green hover:underline">Privacy Policy</a> {" "}
                                to learn more about your experience on SciBitHub.
                            </p>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function Section({ classname, title, content }: { classname?: string, title?: string; content: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={classname || "lg:col-span-2"}
        >
            <Card className="bg-muted/30 border border-border">
                <CardContent className="p-6">
                    {!!title && <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide">{title}</h2>}
                    <div className="text-foreground/80 leading-relaxed text-sm lg:text-base font-retro">
                        {content}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

const quotes = [
    {
        text: "Science becomes powerful when it's shared.",
        author: "Open Science Collective"
    },
    {
        text: "The progress of science depends on the collaboration of many minds.",
        author: "Alexander von Humboldt"
    },
    {
        text: "The most exciting phrase to hear in science is not 'Eureka!', but 'That's funny...'",
        author: "Isaac Asimov"
    },
    {
        text: "Every great advance in science has issued from a new audacity of imagination.",
        author: "John Dewey"
    },
    {
        text: "Knowledge grows when it is shared, not hoarded.",
        author: "Collaborative Research Network"
    },
    {
        text: "Alone we can do so little; together we can do so much.",
        author: "Helen Keller"
    }
];

export function RotatingQuotesBanner() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % quotes.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="w-full h-40 flex items-center p-4 bg-muted/20 border-y border-border text-center font-retro lg:col-start-3 lg:row-start-1">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <p className="italic text-foreground/80">“{quotes[index].text}”</p>
                    <p className="text-sm mt-2 text-muted-foreground">— {quotes[index].author}</p>
                </motion.div>
            </AnimatePresence>
        </Card>
    );
}
