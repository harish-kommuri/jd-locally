import { getGeographicalData } from "../services/geo_service.js";

export function handleGeo(input) {
  return getGeographicalData(input);
}
