import gql from "gql-tag";
import { request } from "../utils";
import { faker } from "@faker-js/faker";
import { Sweet } from "../../src/models/sweet";
import { Order } from "../../src/models/order";

const query = gql`
  mutation ($sweetName: String!, $orderId: String!) {
    addSweetToOrder(input: { sweetName: $sweetName, orderId: $orderId }) {
      sweet {
        name
        ingredients
        price
        quantityInStock
      }
      order {
        orderId
        status
        customerName
      }
    }
  }
`;

describe("Mutation addSweetToOrder", () => {
  test("should throw when sweet is not found", async () => {
    const variables = {
      sweetName: faker.commerce.productName(),
      orderId: faker.number.int(5).toString(),
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

  test("should throw when order is not found", async () => {
    const variables = {
      sweetName: faker.commerce.productName(),
      orderId: faker.number.int(5).toString(),
    };

    await Sweet.create({
      name: variables.sweetName,
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 1000 }),
      quantityInStock: faker.number.int({ min: 1, max: 1000 }),
    });

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

  test("should return sweet and order when adding sweet to order", async () => {
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

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: {
          sweetName: sweet.name,
          orderId: order.orderId,
        },
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.addSweetToOrder.sweet).toEqual(sweet);
    expect(body.data.addSweetToOrder.order).toEqual(order);

    const foundOders = await Order.find({
      sweetName: sweet.name,
    });
    expect(foundOders.length).toEqual(1);
  });
});
