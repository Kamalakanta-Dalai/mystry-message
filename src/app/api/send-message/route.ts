import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import { Message } from "@/app/model/User";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();

  const { username, context } = await request.json();

  try {
    const foundUser = await UserModel.findOne({ username });
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    //User Found now check whether accepting message or not
    if (!foundUser.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content: context, createdAt: new Date() };

    foundUser.messages.push(newMessage as Message);

    await foundUser.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error sending message", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
