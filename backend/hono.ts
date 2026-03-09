import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { userStore } from "./lib/user-store";

userStore.initialize().then(() => {
  console.log('[Server] UserStore initialized');
}).catch((error) => {
  console.error('[Server] Failed to initialize UserStore:', error);
});

const app = new Hono();

app.use("*", cors());

app.all("/api/trpc/*", async (c) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
  return response;
});

app.get("/api", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;
