# Learning record

Date: 2026-11-13

## Whitespace-only title regression

The first validator checked raw string truthiness. The fixed regression tests were run against that initial version with `node --test test/validation.test.js`: `tests 2`, `pass 0`, `fail 2`, exit code 1. One failure showed that a title containing three spaces was accepted; the other showed that surrounding spaces were retained.

The validator now trims first and checks the trimmed fields. Re-running `node --test test/validation.test.js` reported `tests 2`, `pass 2`, `fail 0`, exit code 0. The local run used Node.js 24.22.1. The separate Express/Supertest route tests were not run here because npm and installed dependencies are unavailable; CI installs dependencies before running them.
