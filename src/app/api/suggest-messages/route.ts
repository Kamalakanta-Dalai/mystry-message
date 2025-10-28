import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function GET(req: Request) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Ask me anything? Anything you are curious about me.",

      config: {
        systemInstruction:
          "Ask three questions and make sure you ask different questions everytime and each question must have a question Number starting with 1",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionNumber: {
                type: Type.STRING,
              },
              question: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
            },
            propertyOrdering: ["questionNumber", "question"],
          },
        },

        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    console.log(response.text);
    return NextResponse.json({ response: response.text }, { status: 200 });
  } catch (error) {
    console.log("Error in chat bot", error);

    console.error({ error: "Error in executing chatbot" }, { status: 500 });
  }
}
