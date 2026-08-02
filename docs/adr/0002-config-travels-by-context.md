# Config travels by context, not by prop

With the `"use client"` boundary inside the library ([ADR-0001](./0001-library-owns-the-use-client-boundary.md)),
the svg config has to cross it as serialized data. Where it crosses determines
how often it is paid for.

We decided config reaches components through the provider's context. A `config`
prop remains as an escape hatch — it wins over context when present — so a
single SVG can render with no provider, and tests and stories need no wrapper.

## Consequences

- Passing `config` to an individual SVG embeds the entire svg map in the RSC
  payload **once per element**. It is an escape hatch, and the documentation
  has to say so; context is the normal path and serializes once.
- The provider takes `config` and nothing else. It accepted a loose svg map and
  friends during development; that path is gone, because an inline map literal
  produced a fresh config identity on every render and re-rendered every SVG
  beneath it, and because omitting every optional prop silently produced an
  empty map that failed only at runtime.
- Consumers who want to build a config by hand still can — `createSvgConfig` is
  exported and pure.
