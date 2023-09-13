import { traceSchema } from "@graphql-debugger/trace-schema";

import SchemaBuilder from "@pothos/core";
import { Objects } from "./objects";

export const builder = new SchemaBuilder<{
  Objects: Objects;
}>({});

builder.queryType({});
builder.mutationType({});

require("./queries");
require("./mutations");
require("./objects");

export const schema = traceSchema({
  schema: builder.toSchema(),
});
