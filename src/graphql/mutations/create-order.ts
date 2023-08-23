import { Order, OrderStatusEnum } from "../../models/order";
import { Sweet } from "../../models/sweet";
import { builder } from "../schema";

export type CreateOrderInput = {
  customerName: string;
  sweetNames: string[];
  quantity: number;
};

export type CreateOrderResponse = {
  order: Order;
};

const CreateOrderInput = builder.inputType("CreateOrderInput", {
  fields: (t) => ({
    customerName: t.string({ required: true }),
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
    resolve: async (root, args) => {
      const sweets = await Sweet.find({
        name: args.input.sweetName,
      });

      if (!sweets.length) {
        throw new Error(`Sweet ${args.input.sweetName} not found`);
      }

      const order = await Order.create({
        customerName: args.input.customerName,
        status: "pending",
      });

      await Sweet.connect({
        from: sweets[0],
        to: order,
        type: "CONTAINS",
      });

      return {
        order,
      };
    },
  })
);
