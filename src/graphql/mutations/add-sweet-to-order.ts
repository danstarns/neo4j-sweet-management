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
    resolve: (root, args) => {
      return {
        sweet: {
          name: args.input.sweetName,
          ingredients: ["cocoa", "sugar"],
          price: 10,
          quantityInStock: 100,
        },
        order: {
          orderId: args.input.orderId,
          status: "pending" as OrderStatusEnum,
          customerName: "John Doe",
        },
      };
    },
  })
);
