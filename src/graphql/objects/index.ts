import { Sweet } from "../../models/sweet";
import { ListSweetsResponseType } from "../queries";

export * from "./sweet";

export interface Objects {
  ListSweetsResponseType: ListSweetsResponseType;
  Sweet: Sweet;
}
