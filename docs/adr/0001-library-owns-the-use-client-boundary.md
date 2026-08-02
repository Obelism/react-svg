# The library owns the `"use client"` boundary

Until v3, `setupReactSvg()` built its components at runtime, closing over the
svg config. That works in React Server Components — a generated component can
still be rendered from a server component — but it forces the `"use client"`
directive into consumer code, because a factory cannot be a client boundary:
marking the library's entry point would make `setupReactSvg` itself a client
reference that no server module could call.

We decided the library marks its own component modules instead, and
`setupReactSvg()` generates nothing. It returns the library's real module
exports, re-typed to the caller's svg map, alongside the config object.

## Consequences

- A consumer's config module stays server-safe. `resolveSvgUrl` and
  `formatSvgPath` are callable during a server render, which is what makes
  preloading a critical SVG from a server-rendered `<head>` possible at all.
  Under the old model those helpers were client references and threw.
- The svg map is no longer forced into the client bundle by the act of
  configuring.
- Renderers must be client components. The config crosses the boundary as
  serialized data, and React refuses plain functions there. This is inherent to
  the boundary, not something the library checks.

  It does not follow that a config holding renderers must itself be client
  code, which is how this was first read — both examples carried a config per
  boundary because of it. A renderer declared in its own `"use client"` module
  and imported into a server-safe config reaches it as a client reference, and
  crosses like any other client component. One server-safe config module can
  therefore serve a whole application, renderers included.
- Rendering behaviour is unchanged: SVG content is still fetched and inserted
  on the client after hydration. Server-rendering the definitions block was
  considered and deliberately left out of scope.
