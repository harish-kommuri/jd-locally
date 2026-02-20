import { handleCompare } from "../controllers/compare_controller.js";
import { MCP_TOOL_SCHEMAS } from "../utils/mcp-schemas.js";

export function registerCompareTool(server) {
  server.registerTool(
    "compare_businesses",
    MCP_TOOL_SCHEMAS.compare_businesses,
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
