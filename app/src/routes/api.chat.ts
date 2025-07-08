import { createServerFn } from "@tanstack/react-start";
import { createDataStreamResponse, StreamData, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getEmotionForMessage } from "src/utils/emotion";
import { generateSystemPrompt } from "src/utils/prompts";
import { getTools } from "src/utils/tools";

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
      historicalEmotions?: Array<
        Array<{ label: string; score: number }> | unknown
      >;
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
      currentEmotions: emotionResults,
      historicalEmotions: data.historicalEmotions || [],
    });
    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: groq("llama-3.1-8b-instant"),
          messages,
          system: systemPrompt,
          tools: getTools(),
          onFinish: (data) => {
            dataStream.writeMessageAnnotation({
              text: data.text,
              emotion: emotionResults[0]?.label || "neutral",
              emotionResults: emotionResults.map(({ label, score }) => ({
                label,
                score,
              })),
            });
          },
          onError: (error) => {
            console.error("Error in AI response:", error);
          },

          maxSteps: 20,
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  });
