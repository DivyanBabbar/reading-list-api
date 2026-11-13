import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

test("CRUD returns consistent status codes and error envelopes", async () => {
  const app = createApp();
  const created = await request(app).post("/api/books").send({ title: "Dune", author: "Frank Herbert" }).expect(201);
  const id = created.body.data.id;
  assert.equal((await request(app).get(`/api/books/${id}`).expect(200)).body.data.title, "Dune");
  await request(app).patch(`/api/books/${id}`).send({ status: "reading" }).expect(200);
  await request(app).delete(`/api/books/${id}`).expect(204);
  const missing = await request(app).get(`/api/books/${id}`).expect(404);
  assert.equal(missing.body.error.code, "NOT_FOUND");
  const invalid = await request(app).post("/api/books").send({ title: " ", author: "A" }).expect(400);
  assert.equal(invalid.body.error.code, "VALIDATION_ERROR");
});
