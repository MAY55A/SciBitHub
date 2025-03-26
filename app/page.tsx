import { FormMessage } from "@/src/components/custom/form-message";
import { Footer } from "@/src/components/custom/footer";
import Hero from "@/src/components/custom/hero";

export default async function Home(props: { searchParams?: { error?: string; error_description?: string; message?: string } }) {
  const searchParams = await props.searchParams;
  if (searchParams?.message) {
    return (
      <div className="w-full flex flex-col items-center h-80 sm:max-w-md p-4 justify-center" >
        <FormMessage classname="py-4 text-md" message={{ success: searchParams.message }} />
      </div >
    )
  }

  if (searchParams?.error) {
    return (
      <div className="w-full flex flex-col items-center h-80 sm:max-w-md p-4 justify-center" >
        <FormMessage classname="py-4 text-md" message={{ error: searchParams.error_description || searchParams.error }} />
      </div >
    )
  }

  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
      </main>
      <Footer />
    </>
  );
}
