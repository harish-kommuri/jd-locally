import { ping } from "../services/ping_service.js";

export function handlePing({ message }) {
  return ping(message);
}
