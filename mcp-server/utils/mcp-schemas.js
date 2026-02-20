export const MCP_TOOL_SCHEMAS = {
  ping: {
    name: "ping",
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
  geo_lookup: {
    name: "geo_lookup",
    title: "Geo Lookup",
    description: "Get geographical data for a location",
    inputSchema: {
      type: "object",
      properties: {
        area: { type: "string" },
        city: { type: "string" },
        pincode: { type: "string" },
        lat: { type: "number" },
        lng: { type: "number" }
      },
      required: []
    }
  },
  category_search: {
    name: "category_search",
    title: "Category Search",
    description: "Search businesses by category with sorting options",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string" },
        sort_by: {
          type: "string",
          enum: ["most_rated", "cheapest", "nearest"]
        }
      },
      required: []
    }
  },
  compare_businesses: {
    name: "compare_businesses",
    title: "Compare Businesses",
    description: "Compare multiple businesses by ID",
    inputSchema: {
      type: "object",
      properties: {
        business_ids: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["business_ids"]
    }
  },
  distance_between: {
    name: "distance_between",
    title: "Distance Between",
    description: "Calculate distance between two coordinates",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "object",
          properties: {
            lat: { type: "number" },
            lng: { type: "number" }
          },
          required: ["lat", "lng"]
        },
        to: {
          type: "object",
          properties: {
            lat: { type: "number" },
            lng: { type: "number" }
          },
          required: ["lat", "lng"]
        }
      },
      required: ["from", "to"]
    }
  },
  business_detail: {
    name: "business_detail",
    title: "Business Detail",
    description: "Get detailed business info by type",
    inputSchema: {
      type: "object",
      properties: {
        business_id: { type: "string" },
        business_name: { type: "string" },
        type: {
          type: "string",
          enum: [
            "quick_info",
            "services",
            "reviews",
            "similar",
            "amenities",
            "highlights",
            "insights",
            "doctors",
            "offers",
            "stores",
            "reels",
            "menu",
            "catalogues",
            "fees"
          ]
        }
      },
      required: ["business_name", "type"]
    }
  }
};

export function getHttpTools() {
  return Object.values(MCP_TOOL_SCHEMAS).map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema
  }));
}
