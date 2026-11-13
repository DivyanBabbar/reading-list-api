import test from "node:test";
import assert from "node:assert/strict";
import { validateBook } from "../src/validation.js";

test("trims title and author and applies the default status", () => {
  assert.deepEqual(validateBook({ title: "  Dune  ", author: "  Frank Herbert " }), { value: { title: "Dune", author: "Frank Herbert", status: "to-read" } });
});

test("rejects whitespace-only required fields and invalid status", () => {
  assert.equal(validateBook({ title: "   ", author: "A" }).error, "title is required");
  assert.match(validateBook({ title: "A", author: "B", status: "done" }).error, /status/);
});
