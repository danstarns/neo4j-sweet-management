import gql from "gql-tag";
import { request } from "../utils";
import { faker } from "@faker-js/faker";
import { Machine } from "../../src/models/machine";

const query = gql`
  mutation ($type: String!, $capacity: Int!) {
    createMachine(input: { type: $type, capacity: $capacity }) {
      machine {
        machineId
        type
        capacity
        status
      }
    }
  }
`;

describe("Mutation createMachine", () => {
  test("should create and return a machine", async () => {
    const variables = {
      type: faker.commerce.productMaterial(),
      capacity: faker.number.int({ min: 1, max: 1000 }),
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

    expect(body.data.createMachine.machine.machineId).toBeDefined();
    expect(body.data.createMachine.machine.type).toEqual(variables.type);
    expect(body.data.createMachine.machine.capacity).toEqual(
      variables.capacity
    );
    expect(body.data.createMachine.machine.status).toEqual("active");

    const foundMachines = await Machine.find({
      machineId: body.data.createMachine.machine.machineId,
    });
    expect(foundMachines.length).toEqual(1);
  });
});
