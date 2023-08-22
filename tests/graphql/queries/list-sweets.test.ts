import gql from "gql-tag";
import { request } from "../../utils";

const query = gql`
  query {
    listSweets {
      ping
    }
  }
`;

describe("Query listSweets", () => {
  test("should return true on ping", async () => {
    const response = await request()
      .post("/graphql")
      .send({ query })
      .set("Accept", "application/json");

    const body = await response.body;
    expect(body.errors).toBeUndefined();

    expect(body.data.listSweets.ping).toEqual(true);
  });
});
