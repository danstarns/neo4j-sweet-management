import gql from "gql-tag";
import { request } from "../utils";
import { faker } from "@faker-js/faker";
import { Sweet } from "../../src/models/sweet";

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

describe("Mutation createSweet", () => {
  test("should throw if the sweet is already created", async () => {
    const variables = {
      name: faker.commerce.productName(),
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 1000 }),
      quantityInStock: faker.number.int({ min: 1, max: 1000 }),
    };

    const sweet = await Sweet.create(variables);

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

  test("should create and return a sweet", async () => {
    const variables = {
      name: faker.commerce.productName(),
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 100 }),
      quantityInStock: faker.number.int({ min: 1, max: 100 }),
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

    const foundSweets = await Sweet.find({ where: { name: variables.name } });
    expect(foundSweets).toHaveLength(1);

    expect(body.data.createSweet.sweet).toEqual(variables);
  });
});
