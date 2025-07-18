"use client"

import { useState } from "react";
import { userInputDataSchema } from "@/src/types/user-form-data";
import { signUpAction } from "@/src/lib/actions/auth-actions";
import { FormMessage } from "@/src/components/custom/form-message";
import { SubmitButton } from "@/src/components/custom/submit-button";
import { useMultistepSignupFormContext } from "@/src/contexts/multistep-signup-form-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";

export default function Signup() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);
  const { formData, clearFormData } = useMultistepSignupFormContext();

  const form = useForm({
    resolver: zodResolver(userInputDataSchema),
    defaultValues: { ...formData, password: formData.id ? undefined : formData.password },
  });

  if (success || error) {
    return (
      <div className="w-full flex flex-col items-center h-80 sm:max-w-md p-4 justify-center">
        <FormMessage classname="py-4 text-md" message={success ? { success } : { error: error! }} />
      </div>
    );
  }

  const onSubmit = () => {
    if (isConfirmed && areTermsAccepted) {
      const finalFormData = { ...formData };
      signUpAction(finalFormData);
      clearFormData();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 w-full max-w-md px-4">
      <h1 className="text-2xl font-medium text-center">Confirm & Sign up</h1>
      <p className="text-sm opacity-80 font-retro">
        Hello <strong className="text-green">{formData.username}</strong>, this is the final step, you are almost there !<br />
        All that's left is to confirm your details.<br />
        Please note that the information you have provided will be **publicly visible** to anyone,
        but you will have the option to edit it later.
        Your role however <strong>cannot</strong> be changed later, so please choose wisely.
      </p>
      <div className="items-top flex space-x-2 font-retro">
        <Checkbox id="checkbox1" checked={isConfirmed}
          onCheckedChange={(checked) => {
            if (checked !== "indeterminate") {
              setIsConfirmed(checked)
            }
          }} />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="checkbox1"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm that my details are correct and understand they will be public.
          </Label>
        </div>
      </div>
      <div className="items-top flex space-x-2 font-retro">
        <Checkbox id="checkbox2" checked={areTermsAccepted}
          onCheckedChange={(checked) => {
            if (checked !== "indeterminate") {
              setAreTermsAccepted(checked)
            }
          }} />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="checkbox2"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I Accept terms and conditions
          </Label>
          <p className="text-sm text-muted-foreground">
            You agree to our <a href="/terms-of-service" target="_blank" className="text-green underline">Terms of Service</a> and our <a href="/privacy" target="_blank" className="text-green underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        {!form.formState.isValid && (
          <div className="text-sm text-red-500">
            <h3>{!form.formState.isValid}</h3>
            <ul>
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  - {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <SubmitButton pendingText="Signing up..." disabled={!isConfirmed || !areTermsAccepted}>
          Sign up
        </SubmitButton>
        <Button variant={"secondary"} type="button" className="w-full" onClick={() => router.push("/sign-up/fields-of-interest")}>
          Go Back
        </Button>
        {error && <FormMessage message={{ error }} />}
        {success && <FormMessage message={{ success }} />}
      </div>
    </form>
  );
}
