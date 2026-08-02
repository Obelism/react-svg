# Examples

- [`next`](next) — Next.js App Router
- [`waku`](waku) — Waku (React server components)

Both run on a single, server-safe config module (`svg-config.ts`) that server
and client components alike import from. The only `"use client"` module either
one writes is the custom renderer, because a renderer is a component.

Both link the library from the repo root, so build it first:

```sh
npm run build          # in the repo root
cd examples/<example>
npm install
npm run dev
```
