import { debug } from "./debug";
import * as neo4j from "./neo4j";
import * as app from "./app";

async function start() {
  try {
    debug("Starting application");

    await neo4j.connect();

    await app.start();

    debug("Application started");
  } catch (error) {
    debug("Application failed to start", error);
    throw error;
  }
}

start();
