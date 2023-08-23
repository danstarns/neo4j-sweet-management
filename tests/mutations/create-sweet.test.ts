import gql from "gql-tag";
import { request } from "../utils";

describe("Mutation createSweet", () => {
  test("should return hardcoded order when endpoint called", async () => {
    const query = gql`
      mutation (
        $name: String!
        $ingredients: [String!]!
        $price: Int!
        $quantityInStock: Int!
      ) {
        createSweet(
          input: {
            name: $name
            ingredients: $ingredients
            price: $price
            quantityInStock: $quantityInStock
          }
        ) {
          sweet {
            name
            ingredients
            price
            quantityInStock
          }
        }
      }
    `;

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: {
          name: "chocolate",
          ingredients: ["cocoa", "sugar"],
          price: 10,
          quantityInStock: 100,
        },
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.createSweet.sweet).toEqual({
      name: "chocolate",
      ingredients: ["cocoa", "sugar"],
      price: 10,
      quantityInStock: 100,
    });
  });
});
