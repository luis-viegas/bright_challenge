import { tool } from "ai";
import { promises as fs } from "fs";
import { fetchPastry } from "src/data/queries";
import z from "zod";

export async function fetchPastries() {
  // Simulate fetching pastries from a database or API but read them from a local JSON file using fs
  const data = await fs.readFile("./db/pastries.json", "utf-8");
  const pastries = JSON.parse(data);
  return pastries.products;
}

const getPastries = tool({
  description: "Get a list of pastries available in the store.",
  parameters: z.preprocess(
    (args) => (args === null || args === undefined ? {} : args),
    z.object({})
  ),
  execute: async () => await fetchPastries(),
});

const showPastry = tool({
  description: "Get a specific pastry to recommend to the user.",
  parameters: z.object({
    id: z.number().describe("The ID of the pastry to retrieve."),
  }),
  execute: async ({ id }) => await fetchPastry({ data: id }),
});

export function getTools() {
  return { getPastries, showPastry };
}
