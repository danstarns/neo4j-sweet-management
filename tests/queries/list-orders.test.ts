import gql from "gql-tag";
import { request } from "../utils";

describe("Query listOrders", () => {
  test("should return list of hardcoded orders", async () => {
    const query = gql`
      query {
        listOrders {
          orders {
            orderId
            customerName
            status
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

    expect(body.data.listOrders.orders).toEqual([
      {
        orderId: "1",
        customerName: "John Doe",
        status: "pending",
      },
    ]);
  });
});
