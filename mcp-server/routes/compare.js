import { handleCompare } from "../controllers/compare_controller.js";
import { getToolSchema } from "../utils/mcp-schemas.js";

export function registerCompareTool(server) {
  server.registerTool(
    "compare_businesses",
    getToolSchema("compare_businesses"),
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
