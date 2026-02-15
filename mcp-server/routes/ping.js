export function registerPingTool(server) {
  server.registerTool(
    "ping",
    {
      title: "Ping",
      description: "Health check",
      inputSchema: {
        type: "object",
        properties: {
          message: { type: "string" }
        },
        required: []
      }
    },
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
