# AGENTS.md

## Project overview

- This is an npm-managed Next.js 16 App Router project using React 19 and
  TypeScript in strict mode.
- Styling uses Tailwind CSS 4. Reuse the existing shadcn/Radix components in
  `components/ui` before adding new UI primitives.
- Import project files through the `@/*` alias when practical.
- Use the Node.js version declared in `.nvmrc` and install dependencies with
  `npm ci`.

## Commands

- `npm run dev`: start the local development server.
- `npm run lint`: run ESLint.
- `npm run typecheck`: run the TypeScript compiler without emitting files.
- `npm run format:check`: check formatting without changing files.
- `npm run check`: run all static checks above.
- `npm run build`: create a production build.
- `npm run format`: format supported files with Prettier.

There is currently no automated test script. Do not report tests as passing
unless a test runner is added and executed.

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
- Keep Server Components as the default. Add `"use client"` only when browser
  APIs, state, effects, or client-only libraries require it.
- Run `npm run check` after code or configuration changes. Also run
  `npm run build` when changing routing, rendering, or build configuration.
- Do not modify generated files or lockfiles unless the change requires it.
- Keep generated output (`.next`, `out`, coverage, and TypeScript build info)
  out of reviews and commits.
- Never commit secrets, API keys, credentials, or local `.env` files. Document
  required variables with placeholder values in `.env.example`.
