import { Machine, MachineStatusEnum } from "../../models/machine";
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
    resolve: (root, args) => {
      return {
        sweet: {
          name: args.input.sweetName,
          ingredients: ["cocoa", "sugar"],
          price: 10,
          quantityInStock: 100,
        },
        machine: {
          machineId: args.input.machineId,
          type: "tosbiba",
          capacity: 100,
          status: "active" as MachineStatusEnum,
        },
      };
    },
  })
);
