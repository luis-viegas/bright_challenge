import { createServerFn } from "@tanstack/react-start";
import { createDataStreamResponse, StreamData, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getEmotionForMessage } from "src/utils/emotion";
import z, { unknown } from "zod";
import { generateSystemPrompt } from "src/utils/prompts";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const generateResponse = createServerFn({
  method: "POST",
  response: "raw",
})
  .validator(
    (d: {
      messages: Array<Message>;
      systemPrompt?: { value: string; enabled: boolean };
    }) => d
  )
  .handler(async ({ data }) => {
    const messages = data.messages
      .filter(
        (msg) =>
          msg.content.trim() !== "" &&
          !msg.content.startsWith("Sorry, I encountered an error")
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content.trim(),
      }));

    const emotionResults = await getEmotionForMessage(
      messages[messages.length - 1].content
    );

    const systemPrompt = generateSystemPrompt({
      emotions: emotionResults,
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: groq("llama-3.3-70b-versatile"),
          messages,
          system: systemPrompt,
          onFinish: (data) => {
            dataStream.writeMessageAnnotation({
              text: data.text,
              emotion: emotionResults[0]?.label || "neutral",
            });
          },

          //maxSteps: 20,
          //tools,
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  });
