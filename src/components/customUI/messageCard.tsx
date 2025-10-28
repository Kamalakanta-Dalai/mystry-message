"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { Message } from "@/app/model/User";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const messageId = message._id;
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${messageId}`
      );

      toast("Delete Request", {
        description: response.data.message,
        position: "bottom-right",
      });
      onMessageDelete("");
    } catch (error) {
      console.log("Error in delete route", error);
    }
  };
  return (
    <div>
      <Card className="relative">
        <CardHeader>
          <CardTitle>New Message</CardTitle>
          <CardDescription>
            {new Date(message.createdAt).toLocaleString()}
          </CardDescription>
          <AlertDialog>
            <AlertDialogTrigger
              asChild
              className="w-8 h-8 absolute  top-4 right-4"
            >
              <Button variant="destructive">
                <DeleteIcon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>

        <CardContent>
          <p>{message.content}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCard;
