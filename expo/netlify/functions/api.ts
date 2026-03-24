import { handle } from "hono/netlify";
import app from "../../backend/hono";

export default handle(app);
