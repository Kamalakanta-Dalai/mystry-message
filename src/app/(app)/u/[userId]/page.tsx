"use client";

import { useParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/app/types/ApiResponse";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { messageSchema } from "@/app/Schemas/messageSchema";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const FeedbackPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<{ key: string; label: string }[]>([
    {
      key: "1",
      label: "How you do'in..!!",
    },
    {
      key: "2",
      label: "Are you single?",
    },
    {
      key: "3",
      label: "What you love the most?",
    },
  ]);
  const params = useParams<{ userId: string }>();
  const username = params.userId;

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const sendMystryMessage = async (data: z.Infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        context: data.content,
      });
      console.log("Send Message Data:", response.data);
      toast("Sent", {
        description: "Mystry Message sent successfully",
        position: "bottom-right",
      });
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description:
          axiosError.response?.data.message || "Failed to send message",
        position: "bottom-right",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
    }
  };

  //! Dependent form value adjustment

  const suggestMessage = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/suggest-messages");

      // Parse the JSON string from the response
      const parsedData = JSON.parse(response.data.response);

      // Transform the data to match the items format
      const transformedItems = parsedData.map((item: any) => ({
        key: item.questionNumber || `q${Math.random()}`,
        label: Array.isArray(item.question)
          ? item.question.join(" ")
          : item.question,
      }));

      setItems(transformedItems);
      toast("Success", {
        description: "Messages generated successfully",
        position: "bottom-right",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description: "Failed generating messages",
        position: "bottom-right",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center bg-white mt-4">
        <section className="flex flex-col items-center">
          <h1 className="lg:text-6xl text-4xl font-bold mb-2">
            Public Profile Link
          </h1>
          <div className="mb-4 lg:min-w-5xl">
            <h2 className="text-lg font-semibold mb-2 py-2 ">
              Send Anonymous Message to {`@${username}`}
            </h2>{" "}
            <form
              id="form-rhf"
              onSubmit={form.handleSubmit(sendMystryMessage)}
              className="mb-4"
            >
              <FieldGroup>
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-message">
                        Message
                      </FieldLabel>

                      <Input
                        {...field}
                        placeholder="type your mystry message"
                        id="form-rhf-message"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" form="form-rhf" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 animate-spin" /> Please Wait
                  </>
                ) : (
                  "Send it"
                )}
              </Button>
            </Field>
          </div>
        </section>
        <Separator />
        <section className="flex flex-col items-center">
          <Button
            type="button"
            onClick={() => suggestMessage()}
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 animate-spin" /> Generating...
              </>
            ) : (
              "Suggest Messages"
            )}
          </Button>
          <div className="mx-auto max-w-md overflow-auto rounded-xl bg-white shadow-md md:max-w-2xl mt-2 mb-2 py-6 px-6">
            {items.length > 0 ? (
              items.map((message, index) => (
                <Button
                  key={message.key}
                  type="button"
                  variant="outline"
                  className="mt-2 ml-2 overflow-y"
                  onClick={() => form.setValue("content", message.label)}
                >
                  {message.label}
                </Button>
              ))
            ) : (
              <p>No Messages Found</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default FeedbackPage;
