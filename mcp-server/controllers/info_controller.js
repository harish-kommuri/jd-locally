import { getAppInfo } from "../services/info_service.js";

export function handleInfo() {
  return getAppInfo();
}
