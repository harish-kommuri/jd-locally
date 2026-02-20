import { handleBusinessDetail } from "../controllers/business_detail_controller.js";
import { MCP_TOOL_SCHEMAS } from "../utils/mcp-schemas.js";

export function registerBusinessDetailTool(server) {
  server.registerTool(
    "business_detail",
    MCP_TOOL_SCHEMAS.business_detail,
    async (payload) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(handleBusinessDetail(payload ?? {}), null, 2)
        }
      ]
    })
  );
}
