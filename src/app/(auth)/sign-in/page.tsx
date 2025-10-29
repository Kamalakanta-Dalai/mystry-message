"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/app/types/ApiResponse";

import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import Link from "next/link";
import { signInSchema } from "@/app/Schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.Infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (response?.error) {
        toast("Login Failed", {
          description: "Incorrect username or password",
          position: "bottom-right",
          action: {
            label: "Close",
            onClick: () => console.log("Close"),
          },
        });
      } else {
        toast("Success", {
          description: response.ok,
          position: "bottom-right",
          action: {
            label: "Close",
            onClick: () => console.log("Close"),
          },
        });
      }

      if (response?.url) {
        router.replace("/dashboard");
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signin of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast("SignIn failed", {
        description: errorMessage,
        position: "bottom-right",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back To Mystry Message
          </h1>
          <p className="mb-4">Sign In to continue your anonymous adventure</p>
        </div>
        <form id="form-rhf" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-email">Email Id</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-email"
                    type="email"
                    placeholder="email"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-password">Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id="form-rhf-password"
                    placeholder="Write a strong password"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Password must be more than 6 characters and less than 8
                    characters.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 animate-spin" /> Please Wait
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </Field>

        <div className="text-center mt-4">
          <p>
            New User?{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
