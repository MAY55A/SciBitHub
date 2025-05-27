import Image from "next/image";

export function HeroSection({ image, title, subtitle, children }: { image: string, title: string, subtitle: string, children?: any }) {
    return (
        <div className="relative w-full h-[50vh]">
            <div className="z-[-1]">
                <Image
                    priority
                    src={image}
                    fill
                    alt="hero image"
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/50"></div>

            </div>

            <div className="relative flex flex-col justify-between w-full h-full text-foreground p-8">
                <div className="mt-16 max-w-3xl">
                    <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
                    <p className="text-muted-foreground/80 text-lg font-medium">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    );
}