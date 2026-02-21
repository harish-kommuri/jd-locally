import { getToolSchema } from "../utils/mcp-schemas.js";

export function registerPingTool(server) {
  server.registerTool(
    "ping",
    getToolSchema("ping"),
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
