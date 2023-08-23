import gql from "gql-tag";
import { request } from "../utils";
import { Sweet } from "../../src/models/sweet";
import { faker } from "@faker-js/faker";
import { Order } from "../../src/models/order";
import * as neo4j from "../../src/neo4j";

describe("Query listOrders", () => {
  beforeAll(async () => {
    await neo4j.driver.executeQuery(`
      MATCH (n:Order)
      DETACH DELETE n
    `);
  });

  test("should list all orders containing a specific sweet.", async () => {
    const query = gql`
      query ($sweetName: String!) {
        listOrders(where: { sweetName: $sweetName }) {
          orders {
            orderId
            customerName
            status
          }
        }
      }
    `;

    const sweet = await Sweet.create({
      name: faker.commerce.productName(),
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 1000 }),
      quantityInStock: faker.number.int({ min: 1, max: 1000 }),
    });

    const order = await Order.create({
      customerName: faker.internet.userName(),
      status: "pending",
    });

    await Sweet.connect({
      sweet,
      node: order,
      type: "CONTAINS",
      direction: "in",
    });

    const response = await request()
      .post("/graphql")
      .send({ query, variables: { sweetName: sweet.name } })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.listOrders.orders).toEqual([order]);
  });

  test("should list all orders in a 'pending' or 'delivered' state.", async () => {
    const query = gql`
      query ($status: OrderStatusEnum!) {
        listOrders(where: { status: $status }) {
          orders {
            orderId
            customerName
            status
          }
        }
      }
    `;

    const sweet = await Sweet.create({
      name: faker.commerce.productName(),
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 1000 }),
      quantityInStock: faker.number.int({ min: 1, max: 1000 }),
    });

    const pendingOrder = await Order.create({
      customerName: faker.internet.userName(),
      status: "pending",
    });

    await Sweet.connect({
      sweet,
      node: pendingOrder,
      type: "CONTAINS",
      direction: "in",
    });

    const deliveredOrder = await Order.create({
      customerName: faker.internet.userName(),
      status: "delivered",
    });

    await Sweet.connect({
      sweet,
      node: deliveredOrder,
      type: "CONTAINS",
      direction: "in",
    });

    const response = await request()
      .post("/graphql")
      .send({ query, variables: { status: "delivered" } })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.listOrders.orders).toEqual([deliveredOrder]);
  });
});
