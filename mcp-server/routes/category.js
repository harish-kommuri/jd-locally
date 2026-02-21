import { handleCategorySearch } from "../controllers/category_controller.js";
import { getToolSchema } from "../utils/mcp-schemas.js";

export function registerCategoryTool(server) {
  server.registerTool(
    "category_search",
    getToolSchema("category_search"),
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
