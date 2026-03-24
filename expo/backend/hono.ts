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

app.use("*", async (c, next) => {
  console.log(`[Hono] Incoming request: ${c.req.method} ${c.req.path} (URL: ${c.req.url})`);
  await next();
});

app.all("/trpc/*", async (c) => {
  console.log(`[tRPC] Matched route. Path: ${c.req.path}`);
  try {
    const response = await fetchRequestHandler({
      endpoint: "/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext,
      onError({ error, path }) {
        console.error(`[tRPC] Error on ${path}:`, error.message);
      },
    });
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('[tRPC] Unhandled error:', error);
    return c.json(
      { error: { message: 'Internal server error' } },
      500
    );
  }
});

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;
