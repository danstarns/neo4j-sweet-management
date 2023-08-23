import { Machine, MachineStatusEnum } from "../../models/machine";
import { builder } from "../schema";

export type CreateMachineInput = {
  type: string;
  capacity: number;
};

export type CreateMachineResponse = {
  machine: Machine;
};

const CreateMachineInput = builder.inputType("CreateMachineInput", {
  fields: (t) => ({
    type: t.string({ required: true }),
    capacity: t.int({ required: true }),
  }),
});

export const CreateMachineResponseObject = builder.objectType(
  "CreateMachineResponse",
  {
    fields: (t) => ({
      machine: t.expose("machine", {
        type: Machine,
      }),
    }),
  }
);

builder.mutationField("createMachine", (t) =>
  t.field({
    type: CreateMachineResponseObject,
    args: {
      input: t.arg({
        type: CreateMachineInput,
        required: true,
      }),
    },
    resolve: async (root, args) => {
      const machine = await Machine.create({
        type: args.input.type,
        capacity: args.input.capacity,
        status: "active" as MachineStatusEnum,
      });

      return {
        machine,
      };
    },
  })
);
