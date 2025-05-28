import createFetchClient from "openapi-fetch";
import type { paths } from "./schema.gen";

export const createGrowthaClient = (apiKey: string) => {
  return createFetchClient<paths>({
    baseUrl: "https://growtha-platform-g159.onrender.com",
    headers: {
      "locai-user-api-key": `${apiKey}`,
      "Content-Type": "application/json",
    },
  });
}

export type GrowthaClient = ReturnType<typeof createGrowthaClient>;
