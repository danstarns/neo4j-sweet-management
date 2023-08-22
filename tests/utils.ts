import supertest from "supertest";
import { app } from "../src/app";

export function request() {
  return supertest(app);
}
