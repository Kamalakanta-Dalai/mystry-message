import { resend } from "@/app/lib/resend";

import VerificationEmail from "../../../emails/verificationEmail";

import { ApiResponse } from "@/app/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Mystry_Msg <mystry_msg@resend.dev>",
      to: email,
      subject: "Mystry Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error("Resend send error:", error);
      return {
        success: false,
        message: (error as any)?.message || "Failed to send verification email",
      };
    }

    if (!data?.id) {
      console.error("Resend returned no message id", { data });
      return { success: false, message: "Email not accepted by provider" };
    }

    console.log("Verification email sent successfully", data.id);
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
