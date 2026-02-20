import { handleGeo } from "../controllers/geo_controller.js";
import { MCP_TOOL_SCHEMAS } from "../utils/mcp-schemas.js";

export function registerGeoTool(server) {
  server.registerTool(
    "geo_lookup",
    MCP_TOOL_SCHEMAS.geo_lookup,
    async (payload) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(handleGeo(payload ?? {}), null, 2)
        }
      ]
    })
  );
}
