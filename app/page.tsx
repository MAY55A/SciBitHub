import { FormMessage } from "@/src/components/custom/form-message";
import { Footer } from "@/src/components/custom/footer";
import Hero from "@/src/components/home/hero";

import LatestProjects from "@/src/components/home/latest-projects";
import LatestDiscussions from "@/src/components/home/latest-discussions";
import HowItWorks from "@/src/components/home/how-it-works";

export default async function Home(props: { searchParams?: Promise<{ error?: string; error_description?: string; message?: string }> }) {
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
    <div className="flex flex-col items-center w-full">
      <Hero />
      <LatestProjects />
      <HowItWorks />
      <LatestDiscussions />
      <Footer />
    </div>
  );
}
