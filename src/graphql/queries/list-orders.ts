import { ar } from "@faker-js/faker";
import { Order, OrderStatusEnum } from "../../models/order";
import { builder } from "../schema";

export type ListOrdersResponse = {
  orders: Order[];
};

export type ListOrdersWhere = {
  sweetName?: string;
};

export const ListOrdersWhere = builder.inputType("ListOrdersWhere", {
  fields: (t) => ({
    sweetName: t.string({ required: false }),
  }),
});

export const ListOrdersResponseObject = builder.objectType(
  "ListOrdersResponse",
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
    args: {
      where: t.arg({
        type: ListOrdersWhere,
        required: false,
      }),
    },
    resolve: async (root, args) => {
      const orders = await Order.find({
        ...(args.where?.sweetName ? { sweetName: args.where.sweetName } : {}),
      });

      return {
        orders,
      };
    },
  })
);
