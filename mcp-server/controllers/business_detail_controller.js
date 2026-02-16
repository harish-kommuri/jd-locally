import { getBusinessDetail } from "../services/business_detail_service.js";

export function handleBusinessDetail(input) {
  return getBusinessDetail(input);
}
