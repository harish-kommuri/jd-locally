import { handleCategorySearch } from "../controllers/category_controller.js";

export function registerCategoryTool(server) {
  server.registerTool(
    "category_search",
    {
      title: "Category Search",
      description: "Search businesses by category with sorting options",
      inputSchema: {
        type: "object",
        properties: {
          category: { type: "string" },
          sort_by: {
            type: "string",
            enum: ["most_rated", "cheapest", "nearest"]
          }
        },
        required: []
      }
    },
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
