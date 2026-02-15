import cors from "cors";
import express from "express";

import { handleCategorySearch } from "./controllers/category_controller.js";
import { handleCompare } from "./controllers/compare_controller.js";
import { handleDistance } from "./controllers/distance_controller.js";
import { handleGeo } from "./controllers/geo_controller.js";
import { handleInfo } from "./controllers/info_controller.js";
import { handlePing } from "./controllers/ping_controller.js";

export function startHttpServer(port = process.env.MCP_HTTP_PORT || 4545) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/info", (req, res) => {
    res.json(handleInfo());
  });

  app.get("/tools", (req, res) => {
    res.json({
      tools: [
        "ping",
        "geo_lookup",
        "category_search",
        "compare_businesses",
        "distance_between"
      ]
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

  return app.listen(port, () => {
    console.log(`MCP HTTP server listening on ${port}`);
  });
}
