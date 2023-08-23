import { Order, OrderStatusEnum } from "../../models/order";
import { builder } from "../schema";

export type CreateOrderInput = {
  userEmail: string;
  sweetName: string;
  quantity: number;
};

export type CreateOrderResponse = {
  order: Order;
};

const CreateOrderInput = builder.inputType("CreateOrderInput", {
  fields: (t) => ({
    userEmail: t.string({ required: true }),
    sweetName: t.string({ required: true }),
    quantity: t.int({ required: true }),
  }),
});

export const CreateOrderResponseObject = builder.objectType(
  "CreateOrderResponse",
  {
    fields: (t) => ({
      order: t.expose("order", {
        type: Order,
      }),
    }),
  }
);

builder.mutationField("createOrder", (t) =>
  t.field({
    type: CreateOrderResponseObject,
    args: {
      input: t.arg({
        type: CreateOrderInput,
        required: true,
      }),
    },
    resolve: () => {
      return {
        order: {
          orderId: "1",
          customerName: "John Doe",
          status: "pending" as OrderStatusEnum,
        },
      };
    },
  })
);
