import { getSessionContext } from "@blitzjs/server";
import http from "http";
import { UserError } from "./UserError";

export function requireLogin() {
  return async function (req: http.IncomingMessage, res: http.ServerResponse) {
    const session = await getSessionContext(req, res);
    if (session.userId !== undefined) {
      throw new UserError("require login");
    }
    return;
  };
}
