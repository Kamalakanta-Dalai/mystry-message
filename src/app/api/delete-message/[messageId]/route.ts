import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/app/model/User";

//?Imp: How to get params or get dynamic input from the link in server side
export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  const messageId = params?.messageId;
  await dbConnect();

  //?Imp: How to get session in server side without using useSession
  const session = await auth();

  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  console.log("messageId:", messageId);
  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or deleted already",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message Deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("errorin deleting message", error);

    return Response.json(
      {
        success: false,
        message: "Error deleteing message",
      },
      { status: 500 }
    );
  }
}
