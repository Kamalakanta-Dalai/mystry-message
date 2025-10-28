import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const correctedUsername = decodedUsername.toLowerCase();

    const user = await UserModel.findOne({
      username: correctedUsername,
    });
    console.log("user:", user);
    const isCodeValid = user?.verifyCode === code;
    const isCodeNotExpired = user?.verifyCodeExpiry
      ? new Date(user.verifyCodeExpiry) > new Date()
      : false;

    console.log(isCodeNotExpired);

    if (isCodeValid && isCodeNotExpired && user) {
      user.isVerified = true;
      await user.save();
      console.log("Success block");
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      console.log("Expiry block");
      return Response.json(
        {
          success: false,
          message:
            "Verification Code expired please sign-up again to get a new code",
        },
        { status: 400 }
      );
    } else {
      console.log("Invalid block");
      return Response.json(
        {
          success: false,
          message: "Verification Code is invalid",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);

    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
