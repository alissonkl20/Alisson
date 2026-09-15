import type { Context, Next } from "hono";
import { config } from "./config.js";

export async function bearerAuth(c: Context, next: Next) {
  const header = c.req.header("Authorization")?.trim();
  if (!config.token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (header !== `Bearer ${config.token}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
}
