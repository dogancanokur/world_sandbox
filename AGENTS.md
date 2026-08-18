# AGENTS.md

## Next.js

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This project may use a Next.js version with breaking changes compared to the
model's training data.

Before writing or modifying Next.js code:

1. Read the relevant documentation under `node_modules/next/dist/docs/`.
2. Do not rely on remembered Next.js APIs or conventions when local
   documentation is available.
3. Follow the project's installed Next.js version and its local documentation
   as the source of truth.
4. Heed all deprecation notices and prefer the documented replacement APIs.
5. Check existing project patterns before introducing new routing, caching,
   rendering, middleware, configuration, or data-fetching conventions.

<!-- END:nextjs-agent-rules -->

## General project rules

- Follow the existing project structure and naming conventions.
- Prefer small, focused changes over unrelated refactors.
- Do not introduce new dependencies unless they are necessary.
- Reuse existing components and utilities where practical.
- Keep TypeScript types strict; avoid `any` unless there is a clear reason.
- Run the relevant lint, type-check, and test commands after changes.
- Do not modify generated files or lockfiles unless the change requires it.
- Never commit secrets, API keys, credentials, or `.env` contents.