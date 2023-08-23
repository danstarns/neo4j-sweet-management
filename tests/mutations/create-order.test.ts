import gql from "gql-tag";
import { request } from "../utils";

describe("Mutation createOrder", () => {
  test("should return hardcoded order when endpoint called", async () => {
    const query = gql`
      mutation ($sweetName: String!, $userEmail: String!, $quantity: Int!) {
        createOrder(
          input: {
            sweetName: $sweetName
            userEmail: $userEmail
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

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: {
          sweetName: "Chocolate",
          userEmail: "email@email.com",
          quantity: 1,
        },
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.createOrder.order).toEqual({
      orderId: "1",
      customerName: "John Doe",
      status: "pending",
    });
  });
});
