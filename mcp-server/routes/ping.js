import { MCP_TOOL_SCHEMAS } from "../utils/mcp-schemas.js";

export function registerPingTool(server) {
  server.registerTool(
    "ping",
    MCP_TOOL_SCHEMAS.ping,
    async (payload) => ({
      content: [
        {
          type: "text",
          text: payload
            ? `pong: ${payload.message ?? ""}`.trim()
            : "pong"
        }
      ]
    })
  );
}
