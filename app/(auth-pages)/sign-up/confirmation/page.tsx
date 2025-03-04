"use client"

import { useState } from "react";
import { inputDataSchema } from "@/src/types/user-form-data";
import { signUpAction } from "@/src/utils/auth-actions";
import { FormMessage } from "@/src/components/custom/form-message";
import { SubmitButton } from "@/src/components/custom/submit-button";
import { useMultistepFormContext } from "@/src/contexts/multistep-form-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useForm, Form } from "react-hook-form";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/src/components/ui/button";

export default function Signup() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  if (success || error) {
    return (
      <div className="w-full flex flex-col items-center h-80 sm:max-w-md p-4 justify-center">
        <FormMessage classname="bg-muted rounded-md py-4 text-lg" message={success ? { success } : { error: error! }} />
      </div>
    );
  }
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { formData, clearFormData } = useMultistepFormContext();

  const form = useForm({
    resolver: zodResolver(inputDataSchema),
    defaultValues: {...formData, password: formData.id ? undefined : formData.password},
  });

  const onSubmit = () => {
    if (isConfirmed && isTermsAccepted) {
      const finalFormData = { ...formData };
      //alert(JSON.stringify(finalFormData, null, 2));
      signUpAction(finalFormData);
      clearFormData();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-md px-4">
        <h1 className="text-2xl font-medium">Confirm & Sign up</h1>
        <p className="text-sm text-muted-foreground">
          Hello <strong className="text-green">{formData.username}</strong>, this is the final step, you are almost there !<br />
          All that's left is to confirm your details.<br />
          Please note that the information you have provided will be **publicly visible** to anyone,
          but you will have the option to edit it later.
        </p>
        <div className="items-top flex space-x-2">
          <Checkbox id="checkbox1" checked={isConfirmed}
            onCheckedChange={setIsConfirmed} />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="checkbox1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I confirm that my details are correct and understand they will be public.
            </label>
          </div>
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox id="checkbox2" checked={isTermsAccepted}
            onCheckedChange={setIsTermsAccepted} />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="checkbox2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I Accept terms and conditions
            </label>
            <p className="text-sm text-muted-foreground">
              You agree to our <a href="/tos" className="text-green underline">Terms of Service</a> and our <a href="/privacy" className="text-green underline">Privacy Policy</a>.
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
          <SubmitButton pendingText="Signing up..." disabled={!isConfirmed || !isTermsAccepted}>
            Sign up
          </SubmitButton>
          <Button variant={"secondary"} type="button" className="w-full" onClick={() => router.push("/sign-up/fields-of-interest")}>
            Go Back
          </Button>
          {error && <FormMessage message={{ error }} />}
          {success && <FormMessage message={{ success }} />}
        </div>
      </form>
    </Form>
  );
}
