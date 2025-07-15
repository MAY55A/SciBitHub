"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/src/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu"

const components = {
    "projects": [
        {
            title: "Ongoing Projects",
            href: "/projects?activityStatus=ongoing",
            description:
                "Explore active projects and make some contributions.",
        },
        {
            title: "Completed Projects",
            href: "/projects?activityStatus=completed",
            description:
                "View completed projects and learn about their outcomes.",
        },
        {
            title: "Create New Project",
            href: "/projects/create",
            description:
                "Start your own project and collaborate with the community.",
        },
    ],
    "discussions": [
        {
            title: "Recent Discussions",
            href: "/discussions?orderBy=created_at&sort=desc",
            description: "See the latest discussions from all topics.",
        },
        {
            title: "Popular Discussions",
            href: "/discussions?orderBy=replies&sort=desc",
            description: "View trending and most active discussions.",
        },
    ]
}

export function Nav() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="relative flex h-full w-full select-none flex-col justify-end rounded-md bg-[url('/images/bg-2.jpg')] bg-cover bg-center bg-no-repeat from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/projects"
                                    >
                                        <div className="absolute inset-0 bg-muted/70 rounded-md"></div>
                                        <div className="z-10 mb-2 mt-4 text-lg font-medium">
                                            Explore Projects
                                        </div>
                                        <p className="z-10 text-sm leading-tight text-muted-foreground">
                                            Discover projects in various domains and see how others are collaborating.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            {components.projects.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Discussions</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.discussions.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/about">
                            About
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
