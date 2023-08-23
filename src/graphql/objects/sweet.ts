import { Machine } from "../../models/machine";
import { Order } from "../../models/order";
import { Sweet } from "../../models/sweet";
import { builder } from "../schema";
import { MachineObject } from "./machine";
import { OrderObject } from "./order";

export const SweetObject = builder.objectType(Sweet, {
  name: Sweet.name,
  fields: (t) => ({
    name: t.exposeString("name"),
    ingredients: t.exposeStringList("ingredients"),
    price: t.exposeInt("price"),
    quantityInStock: t.exposeInt("quantityInStock"),
    machine: t.field({
      type: MachineObject,
      nullable: true,
      resolve: async (sweet) => {
        const machine = await Machine.find({
          sweetName: sweet.name,
        });

        return machine[0];
      },
    }),
    orders: t.field({
      type: [OrderObject],
      nullable: true,
      resolve: async (sweet) => {
        const orders = await Order.find({
          sweetName: sweet.name,
        });

        return orders;
      },
    }),
  }),
});
