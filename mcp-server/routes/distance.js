import { handleDistance } from "../controllers/distance_controller.js";
import { MCP_TOOL_SCHEMAS } from "../utils/mcp-schemas.js";

export function registerDistanceTool(server) {
  server.registerTool(
    "distance_between",
    MCP_TOOL_SCHEMAS.distance_between,
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
