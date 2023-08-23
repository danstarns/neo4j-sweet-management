import { Machine } from "../../models/machine";
import { Sweet } from "../../models/sweet";
import { builder } from "../schema";

export type AddSweetToMachineInput = {
  sweetName: string;
  machineId: string;
};

export type AddSweetToMachineResponse = {
  sweet: Sweet;
  machine: Machine;
};

const AddSweetToMachineInput = builder.inputType("AddSweetToMachineInput", {
  fields: (t) => ({
    sweetName: t.string({ required: true }),
    machineId: t.string({ required: true }),
  }),
});

export const AddSweetToMachineResponseObject = builder.objectType(
  "AddSweetToMachineResponse",
  {
    fields: (t) => ({
      sweet: t.expose("sweet", {
        type: Sweet,
      }),
      machine: t.expose("machine", {
        type: Machine,
      }),
    }),
  }
);

builder.mutationField("addSweetToMachine", (t) =>
  t.field({
    type: AddSweetToMachineResponseObject,
    args: {
      input: t.arg({
        type: AddSweetToMachineInput,
        required: true,
      }),
    },
    resolve: async (root, args) => {
      const [sweets, machines] = await Promise.all([
        Sweet.find({ name: args.input.sweetName }),
        Machine.find({ machineId: args.input.machineId }),
      ]);

      if (!sweets.length) {
        throw new Error(`Sweet ${args.input.sweetName} not found`);
      }

      if (!machines.length) {
        throw new Error(`Machine ${args.input.machineId} not found`);
      }

      return {
        sweet: sweets[0],
        machine: machines[0],
      };
    },
  })
);
