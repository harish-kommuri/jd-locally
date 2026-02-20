import cors from "cors";
import express from "express";

import { handleCategorySearch } from "./controllers/category_controller.js";
import { handleCompare } from "./controllers/compare_controller.js";
import { handleBusinessDetail } from "./controllers/business_detail_controller.js";
import { handleDistance } from "./controllers/distance_controller.js";
import { handleGeo } from "./controllers/geo_controller.js";
import { handleInfo } from "./controllers/info_controller.js";
import { handlePing } from "./controllers/ping_controller.js";

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
      tools: [
        {
          name: "ping",
          description: "Health check tool to verify MCP server is responding.",
          inputSchema: {
            type: "object",
            properties: {},
            required: []
          }
        },
        {
          name: "geo_lookup",
          description: "Look up geographic coordinates (latitude, longitude) for a given location name or address.",
          inputSchema: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "Location name or address to look up"
              }
            },
            required: ["location"]
          }
        },
        {
          name: "category_search",
          description: "Search for businesses by category within a location. Returns a list of matching businesses.",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Business category to search (e.g., restaurants, hotels, hospitals)"
              },
              location: {
                type: "string",
                description: "City or area to search in"
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return"
              }
            },
            required: ["category", "location"]
          }
        },
        {
          name: "compare_businesses",
          description: "Compare two or more businesses by their attributes such as ratings, price, distance, and amenities.",
          inputSchema: {
            type: "object",
            properties: {
              business_ids: {
                type: "array",
                items: { type: "string" },
                description: "List of business IDs to compare"
              }
            },
            required: ["business_ids"]
          }
        },
        {
          name: "distance_between",
          description: "Calculate the distance between two locations or between a user location and a business.",
          inputSchema: {
            type: "object",
            properties: {
              from: {
                type: "string",
                description: "Starting location (address, place name, or coordinates)"
              },
              to: {
                type: "string",
                description: "Destination location (address, place name, or coordinates)"
              }
            },
            required: ["from", "to"]
          }
        },
        {
          name: "business_detail",
          description: "Get detailed information about a specific business including address, contact, hours, ratings, reviews, and amenities.",
          inputSchema: {
            type: "object",
            properties: {
              business_id: {
                type: "string",
                description: "The unique identifier of the business"
              }
            },
            required: ["business_id"]
          }
        }
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

  app.post("/tools/business_detail", (req, res) => {
    res.json({ result: handleBusinessDetail(req.body ?? {}) });
  });

  return app.listen(port, () => {
    console.log(`MCP HTTP server listening on ${port}`);
  });
}
