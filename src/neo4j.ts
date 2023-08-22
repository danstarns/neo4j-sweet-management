import neo4j from "neo4j-driver";
import { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } from "./config";
import { debug } from "./debug";

export const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

export async function connect() {
  try {
    debug("Connecting to Neo4j");

    const serverInfo = await driver.getServerInfo();

    debug(`Connected to Neo4j Server ${serverInfo.address}`);
  } catch (error) {
    debug("Failed to connect to Neo4j", error);
    throw error;
  }
}
