import { handleDistance } from "../controllers/distance_controller.js";
import { getToolSchema } from "../utils/mcp-schemas.js";

export function registerDistanceTool(server) {
  server.registerTool(
    "distance_between",
    getToolSchema("distance_between"),
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
