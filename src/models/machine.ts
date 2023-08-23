import { z } from "zod";
import * as neo4j from "../neo4j";

export const MachineStatusEnumSchema = z.enum([
  "active",
  "inactive",
  "maintenance",
]);
export type MachineStatusEnum = z.infer<typeof MachineStatusEnumSchema>;

export const MachineSchema = z.object({
  machineId: z.string(),
  type: z.string(),
  capacity: z.number(),
  status: MachineStatusEnumSchema,
});

export class Machine implements z.infer<typeof MachineSchema> {
  public machineId: string;
  public type: string;
  public capacity: number;
  public status: MachineStatusEnum;

  constructor(Machine: z.infer<typeof MachineSchema>) {
    const { machineId, type, capacity, status } = MachineSchema.parse(Machine);

    this.machineId = machineId;
    this.type = type;
    this.capacity = capacity;
    this.status = status;
  }

  public static async find({
    machineId,
  }: {
    machineId: string;
  }): Promise<Machine[]> {
    const query = `
        MATCH (m:Machine {machineId: $machineId})
        RETURN {
            machineId: m.machineId,
            type: m.type,
            capacity: m.capacity,
            status: m.status
        }
    `;

    const result = await neo4j.driver.executeQuery(query, {
      machineId,
    });

    const machines = result.records.map((record) => new Machine(record.get(0)));

    return machines;
  }

  public static async create(
    machine: Omit<z.infer<typeof MachineSchema>, "machineId">
  ): Promise<Machine> {
    const query = `
        CREATE (m:Machine) 
        SET m = $machine
        SET m.machineId = randomUUID()
        RETURN {
            machineId: m.machineId,
            type: m.type,
            capacity: m.capacity,
            status: m.status
        }
      `;

    const result = await neo4j.driver.executeQuery(query, {
      machine,
    });

    return new Machine(result.records[0].get(0));
  }
}
