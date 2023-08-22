import { Sweet } from "../../models/sweet";
import { builder } from "../schema";

export const SweetObject = builder.objectType(Sweet, {
  name: Sweet.name,
  fields: (t) => ({
    name: t.exposeString("name"),
    ingredients: t.exposeStringList("ingredients"),
    price: t.exposeInt("price"),
    quantityInStock: t.exposeInt("quantityInStock"),
  }),
});
