import { handleGeo } from "../controllers/geo_controller.js";
import { getToolSchema } from "../utils/mcp-schemas.js";

export function registerGeoTool(server) {
  server.registerTool(
    "geo_lookup",
    getToolSchema("geo_lookup"),
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
