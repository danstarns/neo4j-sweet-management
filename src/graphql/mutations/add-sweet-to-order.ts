import { Order, OrderStatusEnum } from "../../models/order";
import { Sweet } from "../../models/sweet";
import { builder } from "../schema";

export type AddSweetToOrderInput = {
  sweetName: string;
  orderId: string;
};

export type AddSweetToOrderResponse = {
  sweet: Sweet;
  order: Order;
};

const AddSweetToOrderInput = builder.inputType("AddSweetToOrderInput", {
  fields: (t) => ({
    sweetName: t.string({ required: true }),
    orderId: t.string({ required: true }),
  }),
});

export const AddSweetToOrderResponseObject = builder.objectType(
  "AddSweetToOrderResponse",
  {
    fields: (t) => ({
      sweet: t.expose("sweet", {
        type: Sweet,
      }),
      order: t.expose("order", {
        type: Order,
      }),
    }),
  }
);

builder.mutationField("addSweetToOrder", (t) =>
  t.field({
    type: AddSweetToOrderResponseObject,
    args: {
      input: t.arg({
        type: AddSweetToOrderInput,
        required: true,
      }),
    },
    resolve: async (root, args) => {
      const [sweets, orders] = await Promise.all([
        Sweet.find({ name: args.input.sweetName }),
        Order.find({ orderId: args.input.orderId }),
      ]);

      if (!sweets.length) {
        throw new Error(`Sweet ${args.input.sweetName} not found`);
      }

      if (!orders.length) {
        throw new Error(`Order ${args.input.orderId} not found`);
      }

      await Sweet.connect({
        from: sweets[0],
        to: orders[0],
        type: "CONTAINS",
      });

      return {
        sweet: sweets[0],
        order: orders[0],
      };
    },
  })
);
