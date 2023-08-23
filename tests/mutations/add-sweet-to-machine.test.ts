import gql from "gql-tag";
import { request } from "../utils";
import { faker } from "@faker-js/faker";
import { Sweet } from "../../src/models/sweet";
import { Machine } from "../../src/models/machine";

const query = gql`
  mutation ($sweetName: String!, $machineId: String!) {
    addSweetToMachine(input: { sweetName: $sweetName, machineId: $machineId }) {
      sweet {
        name
        ingredients
        price
        quantityInStock
      }
      machine {
        machineId
        type
        capacity
        status
      }
    }
  }
`;

describe("Mutation addSweetToMachine", () => {
  test("should throw when sweet is not found", async () => {
    const variables = {
      sweetName: faker.commerce.productName(),
      machineId: faker.number.int(5).toString(),
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

  test("should throw when machine is not found", async () => {
    const sweet = await Sweet.create({
      name: faker.commerce.productName(),
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 100 }),
      quantityInStock: faker.number.int({ min: 1, max: 100 }),
    });

    const variables = {
      sweetName: sweet.name,
      machineId: faker.number.int(5).toString(),
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

  test("should return sweet and machine when adding sweet to machine", async () => {
    const sweet = await Sweet.create({
      name: faker.commerce.productName(),
      ingredients: [
        faker.commerce.productMaterial(),
        faker.commerce.productMaterial(),
      ],
      price: faker.number.int({ min: 1, max: 1000 }),
      quantityInStock: faker.number.int({ min: 1, max: 1000 }),
    });

    const machine = await Machine.create({
      type: faker.commerce.productName(),
      capacity: faker.number.int({ min: 1, max: 1000 }),
      status: "active",
    });

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: {
          sweetName: sweet.name,
          machineId: machine.machineId,
        },
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.addSweetToMachine.sweet).toEqual(sweet);
    expect(body.data.addSweetToMachine.machine).toEqual(machine);
  });
});
