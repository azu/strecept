import http from "http";
import { UserError } from "./UserError";

export type Middleware = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;

export function wrapHandler(
  middlewares: Middleware[],
  handler: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>
) {
  return async function (req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      for (const middleware of middlewares) {
        await middleware(req, res);
      }
      await handler(req, res);
    } catch (error) {
      console.error("[Error]", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      const message = error instanceof UserError ? error.message : "server error";
      res.end(
        JSON.stringify({
          ok: false,
          message: message,
        })
      );
    }
  };
}
