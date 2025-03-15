import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    input: "./openapi.json",
    output: {
      mode: "split",
      client: "fetch",
      target: "src/gen/endpoints",
      schemas: "src/gen/models",
      mock: true,
      baseUrl: "http://127.0.0.1:50021",
    },
  },
});
