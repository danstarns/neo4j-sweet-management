import * as dotenv from "dotenv";
dotenv.config();

export const HTTP_PORT = process.env.HTTP_PORT || 3000;

export const NEO4J_URI = process.env.NEO4J_URI || "bolt://localhost:7687";

export const NEO4J_USER = process.env.NEO4J_USER || "neo4j";

export const NEO4J_PASSWORD =
  process.env.NEO4J_PASSWORD || "super-strong-password-123";

export const NODE_ENV = process.env.NODE_ENV;
