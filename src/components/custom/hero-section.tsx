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
                    className="object-cover object-center opacity-40"
                />
            </div>

            <div className="relative flex flex-col justify-between w-full h-full text-foreground p-8">
                <div className="mt-16">
                    <h1 className="text-4xl font-bold text-primary">{title}</h1>
                    <p className="text-muted-foreground">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    );
}