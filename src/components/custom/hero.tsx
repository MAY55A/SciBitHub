export default function Hero() {
  return (
    <section className="relative flex flex-col w-full h-[50vh] gap-16 items-center px-8 py-12 text-center">
      <div className="absolute h-full w-full inset-0 bg-[url('/images/bg-1.jpg')] bg-cover bg-center opacity-40"></div>

      <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
        Collaborative Research for Everyone!
      </h1>
      <p className="text-2xl lg:text-3xl !leading-tight mx-auto max-w-xl">
        Join researchers and contributors in advancing science through real-world projects.
      </p>
    </section>
  );
}
