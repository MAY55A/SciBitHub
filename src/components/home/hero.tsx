import DiscussionFormDialog from "../discussions/discussion-form-dialog"
import { CreateProjectButton } from "../projects/create-project-button"
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center text-center px-4 py-20 md:py-48">
      <div className="absolute inset-0 -z-10">
        <Image
          src='/images/bg-1.jpg'
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          quality={90}
          className="opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>
      <h1 className="text-4xl font-bold mb-4">SciBitHub</h1>
      <p className="max-w-xl mx-auto mb-6 text-lg text-muted-foreground">
        A collaborative space to launch research, contribute to science, and engage in meaningful discussions.
      </p>
      <div className="flex justify-center gap-4">
        <CreateProjectButton />
        <DiscussionFormDialog />
      </div>
    </section>
  );
}
