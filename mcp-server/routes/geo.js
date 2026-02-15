import { handleGeo } from "../controllers/geo_controller.js";

export function registerGeoTool(server) {
  server.registerTool(
    "geo_lookup",
    {
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
    async (payload) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(handleGeo(payload ?? {}), null, 2)
        }
      ]
    })
  );
}
