import crypto from "crypto";

export function generateSessionId() {
  return crypto.randomBytes(32).toString("hex"); // secure 64-char hex
}
