import { Forbidden } from "@/src/components/errors/forbidden";
import { MultistepProjectFormProvider } from "@/src/contexts/multistep-project-form-context";
import { getCurrentUserRole } from "@/src/lib/services/permissions-service";
import { UserRole } from "@/src/types/enums";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  const userRole = await getCurrentUserRole();
  if(!userRole) {
    redirect("/sign-in?redirect_to=projects/create")
  }

  if(userRole !== UserRole.RESEARCHER) {
    return <Forbidden message="You do not have the permission to create projects as a contributor."/>;
  }

  return (
    <MultistepProjectFormProvider>{children}</MultistepProjectFormProvider>
  );
}
