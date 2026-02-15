import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerInfoResource } from "./routes/info.js";
import { registerPingTool } from "./routes/ping.js";

const server = new McpServer({
  name: "jd-locally-mcp",
  version: "0.1.0"
});

registerInfoResource(server);
registerPingTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
