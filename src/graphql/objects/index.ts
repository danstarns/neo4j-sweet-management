import { Order, OrderStatusEnum } from "../../models/order";
import { Sweet } from "../../models/sweet";
import { CreateOrderInput, CreateOrderResponse } from "../mutations";
import { ListOrdersResponse, ListSweetsResponse } from "../queries";

export * from "./sweet";
export * from "./order";

export interface Objects {
  Sweet: Sweet;
  ListSweetsResponse: ListSweetsResponse;
  Order: Order;
  ListOrdersResponse: ListOrdersResponse;
  OrderStatusEnum: OrderStatusEnum;
  CreateOrderResponse: CreateOrderResponse;
  CreateOrderInput: CreateOrderInput;
}
