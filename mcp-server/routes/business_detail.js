import { handleBusinessDetail } from "../controllers/business_detail_controller.js";

export function registerBusinessDetailTool(server) {
  server.registerTool(
    "business_detail",
    {
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
    },
    async (payload) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(handleBusinessDetail(payload ?? {}), null, 2)
        }
      ]
    })
  );
}
