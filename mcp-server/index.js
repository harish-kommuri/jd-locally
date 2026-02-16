import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCategoryTool } from "./routes/category.js";
import { registerCompareTool } from "./routes/compare.js";
import { registerBusinessDetailTool } from "./routes/business_detail.js";
import { registerDistanceTool } from "./routes/distance.js";
import { registerGeoTool } from "./routes/geo.js";
import { registerInfoResource } from "./routes/info.js";
import { registerPingTool } from "./routes/ping.js";
import { startHttpServer } from "./http_server.js";

const server = new McpServer({
  name: "jd-locally-mcp",
  version: "0.1.0"
});

registerInfoResource(server);
registerPingTool(server);
registerGeoTool(server);
registerCategoryTool(server);
registerCompareTool(server);
registerDistanceTool(server);
registerBusinessDetailTool(server);

startHttpServer();

const transport = new StdioServerTransport();
await server.connect(transport);
