import { google } from "@ai-sdk/google";
import {
  streamText,
  APICallError,
  UIMessage,
  convertToModelMessages,
  generateText,
} from "ai";

import { NextResponse } from "next/server";
// Allow streaming responses up to 30 seconds
// export const maxDuration = 10;
// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Debug: Log the messages to understand the structure
    console.log("Received messages:", JSON.stringify(messages, null, 2));

    // Validate and filter messages to ensure they have proper role and content
    // const validMessages = messages.filter(
    //   (message) =>
    //     message &&
    //     typeof message === "object" &&
    //     message.role &&
    //     (message as any).content
    // );

    // console.log("Valid messages:", JSON.stringify(validMessages, null, 2));

    // If no valid messages, return default suggestions
    if (messages.length === 0) {
      return NextResponse.json({
        result: {
          text: "What's your favorite hobby?||How was your day?||What are you working on lately?",
        },
      });
    }

    const result = generateText({
      model: google("gemini-2.0-flash"),
      messages: [
        {
          role: "system",
          content:
            "Suggest three regular questions for a messaging platform each message separated by '||'",
        },
        ...convertToModelMessages(messages),
      ],
    });

    return NextResponse.json({ result });
  } catch (error) {
    if (APICallError.isInstance(error)) {
      // Handle the error
      const { name, statusCode, responseHeaders, responseBody, message } =
        error;
      return NextResponse.json(
        {
          name,
          statusCode,
          responseHeaders,
          responseBody,
          message,
        },
        { status: statusCode }
      );
    } else {
      console.error("An unexpected error occured ", error);
      throw error;
    }
  }
}
