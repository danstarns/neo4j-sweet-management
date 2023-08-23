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

  public static async find({
    where,
  }: {
    where: { name: string };
  }): Promise<Sweet[]> {
    const query = `
        MATCH (s:Sweet {name: $name}) 
        RETURN {
            name: s.name,
            ingredients: s.ingredients,
            price: s.price,
            quantityInStock: s.quantityInStock
        }
      `;

    const result = await neo4j.driver.executeQuery(query, {
      name: where.name,
    });

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
    from,
    to,
    type,
  }: {
    from: Sweet;
    to: Machine | Order;
    type: string;
  }): Promise<void> {
    const query = `
        MATCH (s:Sweet {name: $sweetName})
        ${
          to instanceof Machine
            ? `MATCH (to:Machine {machineId: $machineId})`
            : ""
        }
        ${to instanceof Order ? `MATCH (to:Order {orderId: $orderId})` : ""}
        MATCH (m:Machine {machineId: $machineId})
        CREATE (s)-[r:${type}]->(to)
    `;

    await neo4j.driver.executeQuery(query, {
      sweetName: from.name,
      ...(to instanceof Machine ? { machineId: to.machineId } : {}),
      ...(to instanceof Order ? { orderId: to.orderId } : {}),
    });
  }
}
