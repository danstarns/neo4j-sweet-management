import { z } from "zod";

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
}
