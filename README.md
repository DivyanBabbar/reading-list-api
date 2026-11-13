# Reading List API

A small Node.js and Express REST API for a personal reading queue. It supports list, create, read, update, and delete operations, validates request bodies, and returns consistent JSON error envelopes. The current store is in memory and resets when the process restarts.

## Run

Requires Node.js 20 or newer.

```sh
npm install
npm test
npm start
```

The server listens on port 3000 by default. Set `PORT` to change it.

## Routes

| Method | Route | Success |
| --- | --- | --- |
| GET | `/api/books` | 200 with `{ data: [...] }` |
| POST | `/api/books` | 201 and a `Location` header |
| GET | `/api/books/:id` | 200 or 404 |
| PATCH | `/api/books/:id` | 200 or 404 |
| DELETE | `/api/books/:id` | 204 or 404 |

Books require a non-empty title (up to 160 characters) and author (up to 120 characters). `status` is `to-read`, `reading`, or `finished`, defaulting to `to-read`. Validation and malformed JSON errors use HTTP 400; missing IDs use 404.

## Checks

`npm test` runs validation unit tests and Supertest CRUD/status tests. Validation tests run with Node's built-in test runner; endpoint tests require the declared Express and Supertest dependencies installed by `npm install`.

## Learning record

An initial validation check used raw string truthiness, which allowed a title containing only spaces. The regression test asserts that whitespace-only titles are rejected. The current validator trims before checking emptiness and preserves the trimmed value. Re-run `node --test test/validation.test.js` to verify the fixed input rule. No persistence or authentication behavior is claimed.
