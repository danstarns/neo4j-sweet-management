import express from "express";
import * as config from "./config";
import * as graphql from "./graphql";

import { debug } from "./debug";

export const app = express();

app.use(express.json({ limit: "50mb" }));
app.use("/graphql", graphql.yoga);

export async function start() {
  try {
    debug("Starting app");

    await app.listen(config.HTTP_PORT);

    debug("Server Online ", config.HTTP_PORT);

    if (config.NODE_ENV === "development") {
      debug(`GraphQL Playground: http://localhost:${config.HTTP_PORT}/graphql`);
    }
  } catch (error) {
    debug("Failed to connect to start app", error);
    throw error;
  }
}
