'use client'

import { Input } from "@/src/components/ui/input";
import { GoogleButton } from "../../../../src/components/custom/google-button";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { useMultistepSignupFormContext } from "../../../../src/contexts/multistep-signup-form-context";
import { useForm } from "react-hook-form";
import { inputDataSchema, InputData } from "@/src/types/user-form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { checkEmailExists } from "@/src/utils/utils";
import { createClient } from "@/src/utils/supabase/client";

export default function Signup() {

  const router = useRouter();
  const { formData, updateFormData } = useMultistepSignupFormContext();
  const form = useForm({
    resolver: zodResolver(inputDataSchema.pick({ email: true, password: true })),
    defaultValues: { email: formData.email, password: formData.password },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const onSubmit = async (data: Partial<InputData>) => {
      setIsVerifying(true);
      const supabase = await createClient();
      const result = await checkEmailExists(supabase, data.email!);
      setIsVerifying(false);
      if (result.exists) {
        form.setError("email", {
          type: "manual",
          message: result.message,
        });
        return;
      }

      updateFormData(data);
      router.push("/sign-up/name-and-country");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-7 w-full max-w-md px-4"
      >
        <h1 className="text-2xl font-medium">Hello, Join Us !</h1>
        <p className="text-sm text-foreground">
          Already have an account ?{" "}
          <Link className="text-green font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input placeholder="your email address" type="email" {...field}/>
              </FormControl>
              <FormMessage>{isVerifying ? "Verifying email..." : undefined}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="your password" type={showPassword ? "text" : "password"} {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 w-full max-w-md">

          {/* Continue Button (Disabled if no field is selected) */}
          <Button
            type="submit"
            className="w-full"          >
            Continue
          </Button>
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <GoogleButton />
      </form>
    </Form>
  );
}
