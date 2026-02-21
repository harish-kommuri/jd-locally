import { handleBusinessDetail } from "../controllers/business_detail_controller.js";
import { getToolSchema } from "../utils/mcp-schemas.js";

export function registerBusinessDetailTool(server) {
  server.registerTool(
    "business_detail",
    getToolSchema("business_detail"),
    async (payload) => {
      console.log(payload);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(handleBusinessDetail(payload ?? {}), null, 2)
          }
        ]
      }
    });
}
