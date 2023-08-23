import { Machine } from "../../models/machine";
import { builder } from "../schema";

export const MachineEnumObject = builder.enumType("MachineEnum", {
  values: ["active", "inactive", "maintenance"],
});

export const MachineObject = builder.objectType(Machine, {
  name: Machine.name,
  fields: (t) => ({
    machineId: t.exposeString("machineId"),
    type: t.exposeString("type"),
    capacity: t.exposeInt("capacity"),
    status: t.expose("status", {
      type: MachineEnumObject,
    }),
  }),
});
