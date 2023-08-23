import gql from "gql-tag";
import { request } from "../utils";

describe("Mutation addSweetToOrder", () => {
  test("should return sweet and order when adding sweet to order", async () => {
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

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: {
          sweetName: "Chocolate Bar",
          orderId: "12345",
        },
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.addSweetToOrder.sweet).toEqual({
      name: "Chocolate Bar",
      ingredients: ["cocoa", "sugar"],
      price: 10,
      quantityInStock: 100,
    });

    expect(body.data.addSweetToOrder.order).toEqual({
      orderId: "12345",
      status: "pending",
      customerName: "John Doe",
    });
  });
});
