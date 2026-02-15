import { handleDistance } from "../controllers/distance_controller.js";

export function registerDistanceTool(server) {
  server.registerTool(
    "distance_between",
    {
      title: "Distance Between",
      description: "Calculate distance between two coordinates",
      inputSchema: {
        type: "object",
        properties: {
          from: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" }
            },
            required: ["lat", "lng"]
          },
          to: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" }
            },
            required: ["lat", "lng"]
          }
        },
        required: ["from", "to"]
      }
    },
    async (payload) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(handleDistance(payload ?? {}), null, 2)
        }
      ]
    })
  );
}
