import { builder } from "../schema";

export type ListSweetsResponseType = {
  ping: boolean;
};

export const ListSweetsResponseObject = builder.objectType(
  "ListSweetsResponseType",
  {
    fields: (t) => ({
      ping: t.exposeBoolean("ping", {}),
    }),
  }
);

builder.queryField("listSweets", (t) =>
  t.field({
    type: ListSweetsResponseObject,
    resolve: () => {
      return {
        ping: true,
      };
    },
  })
);
