import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { APICallError } from "ai";
import { NextResponse } from "next/server";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Forexample, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment";
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: prompt,
      maxOutputTokens: 400,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
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
