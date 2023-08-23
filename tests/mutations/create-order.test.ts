import gql from "gql-tag";
import { request } from "../utils";
import { faker } from "@faker-js/faker";
import { Order } from "../../src/models/order";
import { Sweet } from "../../src/models/sweet";

const query = gql`
  mutation ($sweetName: String!, $customerName: String!, $quantity: Int!) {
    createOrder(
      input: {
        sweetName: $sweetName
        customerName: $customerName
        quantity: $quantity
      }
    ) {
      order {
        orderId
        customerName
        status
      }
    }
  }
`;

describe("Mutation createOrder", () => {
  test("should throw if the sweet is not found", async () => {
    const variables = {
      sweetName: faker.commerce.productName(),
      customerName: faker.internet.userName(),
      quantity: faker.number.int({ min: 1, max: 1000 }),
    };

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: variables,
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeDefined();
  });

  test("should create and return a order", async () => {
    const sweet = await Sweet.create({
      name: faker.commerce.productName(),
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 1000 }),
      quantityInStock: faker.number.int({ min: 1, max: 1000 }),
    });

    const variables = {
      sweetName: sweet.name,
      customerName: faker.internet.userName(),
      quantity: faker.number.int({ min: 1, max: 1000 }),
    };

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: variables,
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.createOrder.order.orderId).toBeDefined();
    expect(body.data.createOrder.order.customerName).toEqual(
      variables.customerName
    );

    const foundOrder = await Order.find({
      orderId: body.data.createOrder.order.orderId,
    });
    expect(foundOrder.length).toEqual(1);
  });
});
