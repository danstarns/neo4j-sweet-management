import { Order } from "../../models/order";
import { builder } from "../schema";

export const OrderStatusEnumObject = builder.enumType("OrderStatusEnum", {
  values: ["pending", "delivered"],
});

export const OrderObject = builder.objectType(Order, {
  name: Order.name,
  fields: (t) => ({
    orderId: t.exposeString("orderId"),
    customerName: t.exposeString("customerName"),
    status: t.expose("status", {
      type: OrderStatusEnumObject,
    }),
  }),
});
