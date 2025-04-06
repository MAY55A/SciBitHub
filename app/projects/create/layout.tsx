import { NotAuthorized } from "@/src/components/errors/not-authorized";
import { MultistepProjectFormProvider } from "@/src/contexts/multistep-project-form-context";
import { getCurrentUserRole } from "@/src/lib/user-service";
import { UserRole } from "@/src/types/models";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  const userRole = await getCurrentUserRole();
  if(userRole !== UserRole.RESEARCHER) {
    return <NotAuthorized message="Only Researchers can create projects"/>;
  }

  return (
    <MultistepProjectFormProvider>{children}</MultistepProjectFormProvider>
  );
}
