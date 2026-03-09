import app from "../../backend/hono";

export default async (request: Request) => {
  return app.fetch(request);
};

export const config = {
  path: "/api/*",
};
