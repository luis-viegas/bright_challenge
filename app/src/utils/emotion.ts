import { InferenceClient } from "@huggingface/inference";

export async function getEmotionForMessage(message) {
  const hf = new InferenceClient(process.env.HF_API_KEY);

  const model = "SamLowe/roberta-base-go_emotions";

  const results = await hf.textClassification({
    model: model,
    inputs: message,
  });

  console.log("Emotion detection results:", results);

  if (!results || results.length === 0) {
    throw new Error("Could not classify the emotion.");
  }

  return results;
}
