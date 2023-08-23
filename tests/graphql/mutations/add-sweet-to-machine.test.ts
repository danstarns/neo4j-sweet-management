import gql from "gql-tag";
import { request } from "../../utils";

describe("Mutation addSweetToMachine", () => {
  test("should return sweet and machine when adding sweet to machine", async () => {
    const query = gql`
      mutation ($sweetName: String!, $machineId: String!) {
        addSweetToMachine(
          input: { sweetName: $sweetName, machineId: $machineId }
        ) {
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

    const response = await request()
      .post("/graphql")
      .send({
        query,
        variables: {
          sweetName: "Chocolate Bar",
          machineId: "1",
        },
      })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.addSweetToMachine.sweet).toEqual({
      name: "Chocolate Bar",
      ingredients: ["cocoa", "sugar"],
      price: 10,
      quantityInStock: 100,
    });

    expect(body.data.addSweetToMachine.machine).toEqual({
      machineId: "1",
      type: "tosbiba",
      capacity: 100,
      status: "active",
    });
  });
});
