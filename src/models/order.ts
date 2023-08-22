import { z } from "zod";

export const OrderStatusEnumSchema = z.enum(["pending", "delivered"]);
export type OrderStatusEnum = z.infer<typeof OrderStatusEnumSchema>;

export const OrderSchema = z.object({
  orderId: z.string(),
  customerName: z.string(),
  status: OrderStatusEnumSchema,
});

export class Order implements z.infer<typeof OrderSchema> {
  public orderId: string;
  public customerName: string;
  public status: OrderStatusEnum;

  constructor(order: z.infer<typeof OrderSchema>) {
    const { orderId, customerName, status } = OrderSchema.parse(order);

    this.orderId = orderId;
    this.customerName = customerName;
    this.status = status;
  }
}
