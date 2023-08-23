import { Sweet } from "../../models/sweet";
import { builder } from "../schema";

export type ListSweetsResponse = {
  sweets: Sweet[];
};

export type ListSweetsWhere = {
  machineId?: string;
  quantityLT?: number;
};

export const ListSweetsWhere = builder.inputType("ListSweetsWhere", {
  fields: (t) => ({
    machineId: t.string({ required: false }),
    quantityLT: t.int({ required: false }),
  }),
});

export const ListSweetsResponseObject = builder.objectType(
  "ListSweetsResponse",
  {
    fields: (t) => ({
      sweets: t.expose("sweets", {
        type: [Sweet],
      }),
    }),
  }
);

builder.queryField("listSweets", (t) =>
  t.field({
    type: ListSweetsResponseObject,
    args: {
      where: t.arg({
        type: ListSweetsWhere,
        required: false,
      }),
    },
    resolve: async (root, args) => {
      const sweets = await Sweet.find({
        ...(args.where?.machineId ? { machineId: args.where.machineId } : {}),
        ...(args.where?.quantityLT
          ? { quantityLT: args.where.quantityLT }
          : {}),
      });

      return {
        sweets,
      };
    },
  })
);
