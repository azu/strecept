import * as http from "http";
import { wrapHandler } from "../utils/middlwares/wrapHandler";
import { requireLogin } from "../utils/middlwares/requireLogin";

export default wrapHandler([requireLogin()], async function (req: http.IncomingMessage, res: http.ServerResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ name: "John Doe" }));
});
