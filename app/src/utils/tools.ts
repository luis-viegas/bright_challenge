import { tool } from "ai";

const getPastries = tool({
  description: "Get all products from the database",
  parameters: z.object({}),
  execute: async () => await fetchGuitars(),
});
