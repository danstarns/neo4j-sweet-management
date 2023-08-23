import { z } from "zod";
import * as neo4j from "../neo4j";
import { Machine } from "./machine";
import { Order } from "./order";

export const SweetSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  price: z.number(),
  quantityInStock: z.number(),
});

export class Sweet implements z.infer<typeof SweetSchema> {
  public name: string;
  public ingredients: string[];
  public price: number;
  public quantityInStock: number;

  constructor(sweet: z.infer<typeof SweetSchema>) {
    const { name, ingredients, price, quantityInStock } =
      SweetSchema.parse(sweet);

    this.name = name;
    this.ingredients = ingredients;
    this.price = price;
    this.quantityInStock = quantityInStock;
  }

  public static async find(where?: {
    name?: string;
    machineId?: string;
    quantityLT?: number;
  }): Promise<Sweet[]> {
    const { machineId, ...whereProperties } = where || {};

    const query = `
        MATCH (s:Sweet)${
          machineId ? `<-[:PRODUCES]-(m:Machine {machineId: $machineId})` : ""
        }
        ${
          Object.keys(whereProperties).length
            ? `
          WHERE
            ${[
              whereProperties.name ? `s.name = $name` : false,
              whereProperties.quantityLT
                ? `s.quantityInStock < $quantityLT`
                : false,
            ]
              .filter(Boolean)
              .join(" AND ")}`
            : ""
        } 
        RETURN {
            name: s.name,
            ingredients: s.ingredients,
            price: s.price,
            quantityInStock: s.quantityInStock
        }
      `;

    const result = await neo4j.driver.executeQuery(query, where);

    const sweets = result.records.map((record) => {
      const sweet = record.get(0);
      return new Sweet(sweet);
    });

    return sweets;
  }

  public static async create(
    sweet: z.infer<typeof SweetSchema>
  ): Promise<Sweet> {
    const query = `
      CREATE (s:Sweet)
      SET s = $sweet
      RETURN {
        name: s.name,
        ingredients: s.ingredients,
        price: s.price,
        quantityInStock: s.quantityInStock
      }
    `;

    const result = await neo4j.driver.executeQuery(query, {
      sweet,
    });

    return new Sweet(result.records[0].get(0));
  }

  public static async connect({
    sweet,
    node,
    type,
    direction,
  }: {
    sweet: Sweet;
    node: Machine | Order;
    type: string;
    direction: "in" | "out";
  }): Promise<void> {
    const inSrt = `${direction === "in" ? "<-" : "-"}`;
    const outStr = `${direction === "out" ? "->" : "-"}`;

    const query = `
        MATCH (s:Sweet {name: $sweetName})
        ${
          node instanceof Machine
            ? `MATCH (n:Machine {machineId: $machineId})`
            : ""
        }
        ${node instanceof Order ? `MATCH (n:Order {orderId: $orderId})` : ""}

        CREATE (s)${inSrt}[:${type}]${outStr}(n)
    `;

    await neo4j.driver.executeQuery(query, {
      sweetName: sweet.name,
      ...(node instanceof Machine ? { machineId: node.machineId } : {}),
      ...(node instanceof Order ? { orderId: node.orderId } : {}),
    });
  }
}
