import gql from "gql-tag";
import { request } from "../utils";

describe("Mutation createMachine", () => {
  test("should return hardcoded order when endpoint called", async () => {
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

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: {
          type: "toshiba",
          capacity: 100,
        },
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.createMachine.machine).toEqual({
      machineId: "1",
      type: "toshiba",
      capacity: 100,
      status: "active",
    });
  });
});
