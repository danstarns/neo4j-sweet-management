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
    resolve: (root, args) => {
      return {
        sweet: {
          name: args.input.name,
          ingredients: args.input.ingredients,
          price: args.input.price,
          quantityInStock: args.input.quantityInStock,
        },
      };
    },
  })
);
