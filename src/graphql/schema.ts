import SchemaBuilder from "@pothos/core";
import { Objects } from "./types";

export const builder = new SchemaBuilder<{
  Objects: Objects;
}>({});

builder.queryType({});

require("./queries");

export const schema = builder.toSchema();
