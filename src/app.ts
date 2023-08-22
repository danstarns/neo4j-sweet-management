import express from "express";
import * as config from "./config";
import { debug } from "./debug";

export const app = express();

app.use(express.json({ limit: "50mb" }));

export async function start() {
  try {
    debug("Starting app");

    await app.listen(config.HTTP_PORT);

    debug("Server Online ", config.HTTP_PORT);
  } catch (error) {
    debug("Failed to connect to start app", error);
    throw error;
  }
}
