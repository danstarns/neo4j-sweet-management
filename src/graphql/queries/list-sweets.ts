import { Sweet } from "../../models/sweet";
import { builder } from "../schema";

export type ListSweetsResponse = {
  sweets: Sweet[];
};

export const ListSweetsResponseObject = builder.objectType(
  "ListSweetsResponse",
  {
    fields: (t) => ({
      sweets: t.expose("sweets", {
        type: [Sweet],
      }),
    }),
  }
);

builder.queryField("listSweets", (t) =>
  t.field({
    type: ListSweetsResponseObject,
    resolve: () => {
      return {
        sweets: [
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
        ],
      };
    },
  })
);
