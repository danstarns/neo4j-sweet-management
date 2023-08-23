import gql from "gql-tag";
import { request } from "../utils";

describe("Query listSweets", () => {
  test("should return list of hardcoded sweets", async () => {
    const query = gql`
      query {
        listSweets {
          sweets {
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
      .send({ query })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.listSweets.sweets).toEqual([
      {
        name: "Chocolate Cake",
        ingredients: ["chocolate", "flour", "eggs", "sugar"],
        price: 10,
        quantityInStock: 10,
      },
      {
        name: "Vanilla Cake",
        ingredients: ["vanilla", "flour", "eggs", "sugar"],
        price: 10,
        quantityInStock: 10,
      },
    ]);
  });
});
