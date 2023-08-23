import gql from "gql-tag";
import { request } from "../utils";
import { faker } from "@faker-js/faker";
import { Sweet } from "../../src/models/sweet";
import { Machine } from "../../src/models/machine";
import * as neo4j from "../../src/neo4j";
import { promisify } from "util";

const sleep = promisify(setTimeout);

describe("Query listSweets", () => {
  beforeAll(async () => {
    await neo4j.driver.executeQuery(`
      MATCH (n:Sweet)
      DETACH DELETE n
    `);
  });

  test("should list all sweets produced by a specific machine.", async () => {
    const query = gql`
      query ($machineId: String!) {
        listSweets(where: { machineId: $machineId }) {
          sweets {
            name
            ingredients
            price
            quantityInStock
          }
        }
      }
    `;

    const machine = await Machine.create({
      type: faker.commerce.productMaterial(),
      capacity: faker.number.int({ min: 1, max: 100 }),
      status: "active",
    });

    const sweet = await Sweet.create({
      name: faker.commerce.productName(),
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 100 }),
      quantityInStock: faker.number.int({ min: 1, max: 100 }),
    });

    await Sweet.connect({
      sweet,
      node: machine,
      type: "PRODUCES",
      direction: "in",
    });

    const response = await request()
      .post("/graphql")
      .send({ query, variables: { machineId: machine.machineId } })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.listSweets.sweets).toEqual([sweet]);
  });

  test("should list all sweets with a quantity less than a given number.", async () => {
    const query = gql`
      query ($quantityLT: Int!) {
        listSweets(where: { quantityLT: $quantityLT }) {
          sweets {
            name
            ingredients
            price
            quantityInStock
          }
        }
      }
    `;

    const machine = await Machine.create({
      type: faker.commerce.productMaterial(),
      capacity: faker.number.int({ min: 1, max: 100 }),
      status: "active",
    });

    const quantites = [1, 2, 3, 4];

    await Promise.all(
      quantites.map(async (quantity) => {
        const sweet = await Sweet.create({
          name: faker.commerce.productName(),
          ingredients: [
            faker.commerce.productMaterial(),
            faker.commerce.productMaterial(),
          ],
          price: faker.number.int({ min: 1, max: 100 }),
          quantityInStock: quantity,
        });

        await Sweet.connect({
          sweet,
          node: machine,
          type: "PRODUCES",
          direction: "in",
        });
      })
    );

    await sleep(1000); // Lets backoff for all thoes promises to write

    const response = await request()
      .post("/graphql")
      .send({ query, variables: { quantityLT: 4 } })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.listSweets.sweets).toHaveLength(3);
  });
});
