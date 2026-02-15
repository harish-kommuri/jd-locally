import { getCategoryResults } from "../services/category_service.js";

export function handleCategorySearch(input) {
  return getCategoryResults(input);
}
