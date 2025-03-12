
import { MiddlewareHandler } from "@cloudflare/workers-types";

const handler: MiddlewareHandler = async ({ request, next, env }) => {
  try {
    // Handle CORS if needed
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Forward the request to the next handler
    return await next();
  } catch (err) {
    console.error("Middleware error:", err);
    return new Response("Internal Error", { status: 500 });
  }
};

export const onRequest = handler;
