"use client";
import { useCallback, useEffect, useState } from "react";
import { Message } from "@/app/model/User";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/app/types/ApiResponse";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, ArrowLeft } from "lucide-react";
import MessageCard from "@/components/customUI/messageCard";
import * as z from "zod";

import { acceptMessageScehma } from "@/app/Schemas/acceptMessageSchema";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageScehma as any),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      console.log("API Response:", response.data);
      setValue("acceptMessages", response.data.isAcceptingMessage);
      console.log(
        "accept message after setValue:",
        response.data.isAcceptingMessage
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        position: "bottom-right",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refreshed Messages", {
            description: "Showing latest Messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        toast("Error", {
          description:
            axiosError.response?.data.message ||
            "Failed to fetch message settings",
          position: "bottom-right",
          action: {
            label: "Close",
            onClick: () => console.log("Close"),
          },
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  //handleSwitchChange
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast("Status Updated", {
        description: response?.data.message,
        position: "bottom-right",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        position: "bottom-right",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
    }
  };

  const username = session?.user?.username ?? "";
  //TODO: Do more research on this - how to find baseurl
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("URL Copied!", {
      description: "Profile url has been copied succesfully.",
      position: "bottom-right",
    });
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center pt-6">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="my-8  md:mx-8 lg:mx-auto p-6  bg-white rounded w-full max-w-6xl mt-4">
      <div className="relative flex flex-row justify- items-center text-center gap-6">
        <Button className=" w-8 h-8 mb-2" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 bg-blue-100 rounded"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4 " />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              message={message}
              key={index}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No Messages Found</p>
        )}
      </div>
    </div>
  );
};

export default dashboard;
