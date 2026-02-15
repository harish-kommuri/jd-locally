import { compareBusinesses } from "../services/compare_service.js";

export function handleCompare(input) {
  return compareBusinesses(input);
}
