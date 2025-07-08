import { createServerFn } from "@tanstack/react-start";
import { promises as fs } from "fs";
import z from "zod";

export const fetchPastry = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(z.number())
  .handler(async ({ data: id }) => {
    // Simulate fetching pastries from a database or API but read them from a local JSON file using fs
    const data = await fs.readFile("./db/pastries.json", "utf-8");
    const pastries = JSON.parse(data);
    return pastries.products.find((pastry) => pastry.id === id) || null;
  });
