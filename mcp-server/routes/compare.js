import { handleCompare } from "../controllers/compare_controller.js";

export function registerCompareTool(server) {
  server.registerTool(
    "compare_businesses",
    {
      title: "Compare Businesses",
      description: "Compare multiple businesses by ID",
      inputSchema: {
        type: "object",
        properties: {
          business_ids: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["business_ids"]
      }
    },
    async (payload) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(handleCompare(payload ?? {}), null, 2)
        }
      ]
    })
  );
}
