import cors from "cors";
import express from "express";

import { handleCategorySearch } from "./controllers/category_controller.js";
import { handleCompare } from "./controllers/compare_controller.js";
import { handleBusinessDetail } from "./controllers/business_detail_controller.js";
import { handleDistance } from "./controllers/distance_controller.js";
import { handleGeo } from "./controllers/geo_controller.js";
import { handleInfo } from "./controllers/info_controller.js";
import { handlePing } from "./controllers/ping_controller.js";
import { getHttpTools } from "./utils/mcp-schemas.js";

export function startHttpServer(port = process.env.MCP_HTTP_PORT || 4545) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.json({ status: "ok" });
  });

  app.get("/info", (_, res) => {
    res.json(handleInfo());
  });

  app.get("/tools", (_, res) => {
    res.json({
      tools: getHttpTools()
    });
  });

  app.post("/tools/ping", (req, res) => {
    res.json({ result: handlePing(req.body ?? {}) });
  });

  app.post("/tools/geo_lookup", (req, res) => {
    res.json({ result: handleGeo(req.body ?? {}) });
  });

  app.post("/tools/category_search", (req, res) => {
    res.json({ result: handleCategorySearch(req.body ?? {}) });
  });

  app.post("/tools/compare_businesses", (req, res) => {
    res.json({ result: handleCompare(req.body ?? {}) });
  });

  app.post("/tools/distance_between", (req, res) => {
    res.json({ result: handleDistance(req.body ?? {}) });
  });

  app.post("/tools/business_detail", (req, res) => {
    res.json({ result: handleBusinessDetail(req.body ?? {}) });
  });

  return app.listen(port, () => {
    console.log(`MCP HTTP server listening on ${port}`);
  });
}
