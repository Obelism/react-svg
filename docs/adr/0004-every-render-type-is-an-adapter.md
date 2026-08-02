# Every render type is an adapter at one seam

Until v3 the three built-in render types did not satisfy the interface a
consumer renderer had to satisfy. Inline and link were handed the svg config;
external and custom were handed an svg entry, a folder and a loading hint. Two
prop protocols, a four-branch dispatch to choose between them, and two
near-identical types — `SvgRendererProps` and `SvgElementArgs` — describing the
one thing. More render types could be added, but the additions were
second-class: they sat on a protocol the built-ins mostly did not use, and
nothing rendered through the same interface twice.

We decided there is one renderer interface. The built-in three are registered in
a render map and dispatch is a lookup. They receive exactly the props a consumer
renderer receives; the asymmetry is that an internal adapter may reach an
internal hook, never that it is handed more.

A renderer is also given the resolved url rather than the root folder it would
have to join a filename onto itself. Every custom renderer that existed did that
join by hand — the two examples in this repository did it with two different
conventions, each correct only for its own `rootFolder`.

## Consequences

- A consumer cannot write a link-alike. The link render type needs the linked
  set and the definitions block, and both are internal. A render type that needs
  those is a built-in, not a consumer renderer. If that turns out to be too
  strict, the fix is to widen what an adapter may reach — deliberately — rather
  than to hand every renderer the same capability by default.
- The built-ins win over a consumer renderer registered under the same name,
  which is what the branch order did before. `link`, `inline` and `external`
  cannot be replaced, only added to.
- `folder` is gone from the renderer props and `url` replaces it, so the rule
  turning an svg key into a url lives only in `resolveSvgUrl`. This breaks v2
  renderers and is listed in the README's migration table.
- It also fixes a consequence of the old protocol rather than only tidying it:
  because a renderer only ever had `rootFolder`, an entry's `path` override was
  silently ignored by every custom render type, which produced a plausible url
  pointing at the wrong file. Resolving before the seam removes the possibility.
- `SvgRenderer` returns `ReactNode` rather than `JSX.Element | null`, so a
  `memo()`'d component satisfies it — the built-ins are memoized. This is a
  widening; renderers written against the old type still conform.
- No adapter takes `config`. Where the `config` prop escape hatch is used,
  `<Svg />` re-provides the resolved config on context
  ([ADR-0002](./0002-config-travels-by-context.md)), so every adapter reads the
  config one way on both paths and none of them needs it as a prop.
- An adapter has to drop the props it does not render. Every render type now
  receives `loading`, and `<svg>` has no such attribute, so inline and link
  discard it rather than let the pass-through bag carry it onto the element.
- `SvgElementArgs` is deleted. `SvgRendererProps` is the one props type, and it
  stays exported because a consumer writing a typed renderer names it.
- The leaves stay unexported
  ([ADR-0003](./0003-leaf-components-stay-internal.md)). They are adapters at an
  internal seam, not new public surface — registering them changed nothing about
  what the package exports.
