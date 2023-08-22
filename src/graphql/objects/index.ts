import { Order, OrderStatusEnum } from "../../models/order";
import { Sweet } from "../../models/sweet";
import { ListOrdersResponseType, ListSweetsResponseType } from "../queries";
import { OrderStatusEnumObject } from "./order";

export * from "./sweet";
export * from "./order";

export interface Objects {
  Sweet: Sweet;
  ListSweetsResponseType: ListSweetsResponseType;
  Order: Order;
  ListOrdersResponseType: ListOrdersResponseType;
  OrderStatusEnumObject: typeof OrderStatusEnumObject;
  OrderStatusEnum: OrderStatusEnum;
}
