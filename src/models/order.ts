import { z } from "zod";
import * as neo4j from "../neo4j";

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

  public static async find(where?: {
    orderId?: string;
    sweetName?: string;
    status?: OrderStatusEnum;
  }): Promise<Order[]> {
    const { sweetName, ...whereProperties } = where || {};

    const query = `
        MATCH (o:Order)${
          sweetName ? `-[:CONTAINS]->(s:Sweet {name: $sweetName})` : ""
        }
        ${
          Object.keys(whereProperties).length
            ? `
          WHERE
            ${[
              whereProperties.orderId ? `o.orderId = $orderId` : false,
              whereProperties.status ? `o.status = $status` : false,
            ]
              .filter(Boolean)
              .join(" AND ")}`
            : ""
        } 
        RETURN {
            orderId: o.orderId,
            customerName: o.customerName,
            status: o.status
        }
    `;

    const result = await neo4j.driver.executeQuery(query, where);

    const orders = result.records.map((record) => new Order(record.get(0)));

    return orders;
  }

  public static async create(
    order: Omit<z.infer<typeof OrderSchema>, "orderId">
  ): Promise<Order> {
    const query = `
        CREATE (o:${Order.name}) 
        SET o = $order
        SET o.orderId = randomUUID()
        RETURN {
            orderId: o.orderId,
            customerName: o.customerName,
            status: o.status
        }
      `;

    const result = await neo4j.driver.executeQuery(query, {
      order,
    });

    return new Order(result.records[0].get(0));
  }
}
