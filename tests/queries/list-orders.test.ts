import gql from "gql-tag";
import { request } from "../utils";
import { Sweet } from "../../src/models/sweet";
import { faker } from "@faker-js/faker";
import { Order } from "../../src/models/order";

describe("Query listOrders", () => {
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
});
