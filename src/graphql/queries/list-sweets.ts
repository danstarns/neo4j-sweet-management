import { builder } from "../schema";

export type ListSweetsResponseType = {
  pong: boolean;
};

export const ListSweetsResponseObject = builder.objectType(
  "ListSweetsResponseType",
  {
    fields: (t) => ({
      pong: t.exposeBoolean("pong", {}),
    }),
  }
);

builder.queryField("listSweets", (t) =>
  t.field({
    type: ListSweetsResponseObject,
    resolve: () => {
      return {
        pong: true,
      };
    },
  })
);
