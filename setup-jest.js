import * as neo4j from "./src/neo4j";

afterAll(async () => {
  await neo4j.driver.close();
});
