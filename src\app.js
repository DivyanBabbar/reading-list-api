import express from "express";
import { randomUUID } from "node:crypto";
import { validateBook } from "./validation.js";

export function createApp() {
  const app = express();
  const books = new Map();
  app.use(express.json({ limit: "32kb" }));
  app.use((error, _request, response, next) => {
    if (error instanceof SyntaxError && "body" in error) return response.status(400).json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } });
    return next(error);
  });

  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.get("/api/books", (_request, response) => response.json({ data: [...books.values()] }));
  app.post("/api/books", (request, response) => {
    const parsed = validateBook(request.body);
    if (parsed.error) return response.status(400).json({ error: { code: "VALIDATION_ERROR", message: parsed.error } });
    const book = { id: randomUUID(), ...parsed.value, createdAt: new Date().toISOString() };
    books.set(book.id, book);
    return response.status(201).location(`/api/books/${book.id}`).json({ data: book });
  });
  app.get("/api/books/:id", (request, response) => {
    const book = books.get(request.params.id);
    return book ? response.json({ data: book }) : response.status(404).json({ error: { code: "NOT_FOUND", message: "Book not found" } });
  });
  app.patch("/api/books/:id", (request, response) => {
    const current = books.get(request.params.id);
    if (!current) return response.status(404).json({ error: { code: "NOT_FOUND", message: "Book not found" } });
    const parsed = validateBook({ ...current, ...request.body });
    if (parsed.error) return response.status(400).json({ error: { code: "VALIDATION_ERROR", message: parsed.error } });
    const updated = { ...current, ...parsed.value };
    books.set(updated.id, updated);
    return response.json({ data: updated });
  });
  app.delete("/api/books/:id", (request, response) => {
    if (!books.delete(request.params.id)) return response.status(404).json({ error: { code: "NOT_FOUND", message: "Book not found" } });
    return response.status(204).end();
  });
  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } });
  });
  return app;
}
