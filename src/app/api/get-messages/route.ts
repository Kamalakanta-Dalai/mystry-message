import { auth } from "@/auth";
import dbConnect from "@/app/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/app/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    //Aggregation Pipeline
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unexpected error occured", error);
    return Response.json(
      {
        success: false,
        message: "Error in finding the user",
      },
      { status: 404 }
    );
  }
}
