import { MultistepProjectFormProvider } from "@/src/contexts/multistep-project-form-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MultistepProjectFormProvider>{children}</MultistepProjectFormProvider>
  );
}
