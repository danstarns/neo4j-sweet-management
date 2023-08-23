import { Sweet } from "../../models/sweet";
import { builder } from "../schema";

export type CreateSweetInput = {
  name: string;
  ingredients: string[];
  price: number;
  quantityInStock: number;
};

export type CreateSweetResponse = {
  sweet: Sweet;
};

const CreateSweetInput = builder.inputType("CreateSweetInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    ingredients: t.stringList({ required: true }),
    price: t.int({ required: true }),
    quantityInStock: t.int({ required: true }),
  }),
});

export const CreateSweetResponseObject = builder.objectType(
  "CreateSweetResponse",
  {
    fields: (t) => ({
      sweet: t.expose("sweet", {
        type: Sweet,
      }),
    }),
  }
);

builder.mutationField("createSweet", (t) =>
  t.field({
    type: CreateSweetResponseObject,
    args: {
      input: t.arg({
        type: CreateSweetInput,
        required: true,
      }),
    },
    resolve: async (root, args) => {
      const sweets = await Sweet.find({ name: args.input.name });
      if (sweets.length > 0) {
        throw new Error(`Sweet with name ${args.input.name} already exists`);
      }

      const sweet = await Sweet.create(args.input);

      return {
        sweet,
      };
    },
  })
);
