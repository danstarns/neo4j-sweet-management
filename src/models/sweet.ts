import { z } from "zod";
import * as neo4j from "../neo4j";

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
    where: { machineId: string };
  }): Promise<Sweet[]> {
    const result = await neo4j.driver.executeQuery(
      `
        MATCH (s:Sweet {machineId: $machineId}) 
        RETURN {
            name: s.name,
            ingredients: s.ingredients,
            price: s.price,
            quantityInStock: s.quantityInStock
        }
      `,
      {
        machineId: where.machineId,
      }
    );

    const sweets = result.records.map((record) => {
      const sweet = record.get(0);
      return new Sweet(sweet);
    });

    return sweets;
  }
}
