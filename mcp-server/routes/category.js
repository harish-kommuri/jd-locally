import { handleCategorySearch } from "../controllers/category_controller.js";
import { MCP_TOOL_SCHEMAS } from "../utils/mcp-schemas.js";

export function registerCategoryTool(server) {
  server.registerTool(
    "category_search",
    MCP_TOOL_SCHEMAS.category_search,
    async (payload) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(handleCategorySearch(payload ?? {}), null, 2)
        }
      ]
    })
  );
}
