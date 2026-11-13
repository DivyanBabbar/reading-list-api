export function validateBook(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "body must be a JSON object" };
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const author = typeof input.author === "string" ? input.author.trim() : "";
  if (!title) return { error: "title is required" };
  if (title.length > 160) return { error: "title must be 160 characters or fewer" };
  if (!author) return { error: "author is required" };
  if (author.length > 120) return { error: "author must be 120 characters or fewer" };
  const status = input.status ?? "to-read";
  if (!new Set(["to-read", "reading", "finished"]).has(status)) return { error: "status must be to-read, reading, or finished" };
  return { value: { title, author, status } };
}
