import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { handleInfo } from "../controllers/info_controller.js";

export function registerInfoResource(server) {
  server.registerResource(
    "info",
    new ResourceTemplate("info://app"),
    async () => ({
      contents: [
        {
          uri: "info://app",
          mimeType: "application/json",
          text: JSON.stringify(handleInfo(), null, 2)
        }
      ]
    })
  );
}
