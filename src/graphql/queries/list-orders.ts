import { Order, OrderStatusEnum } from "../../models/order";
import { builder } from "../schema";

export type ListOrdersResponseType = {
  orders: Order[];
};

export const ListOrdersResponseObject = builder.objectType(
  "ListOrdersResponseType",
  {
    fields: (t) => ({
      orders: t.expose("orders", {
        type: [Order],
      }),
    }),
  }
);

builder.queryField("listOrders", (t) =>
  t.field({
    type: ListOrdersResponseObject,
    resolve: () => {
      return {
        orders: [
          {
            orderId: "1",
            customerName: "John Doe",
            status: "pending" as OrderStatusEnum,
          },
        ],
      };
    },
  })
);
