# Changelog

## 3.0.1

### Fixed

- **Pages with hundreds of distinct linked svgs no longer stall.** Each
  `type="link"` svg added itself to the linked set from a stale copy, so only
  one svg joined per commit and every commit re-rendered every linked svg on
  the page. Each one also subscribed to the whole set and deep-compared it on
  every write. Under `next dev`, 250 distinct linked svgs took over two
  minutes to settle; they now take under a second. No API changes.

## 3.0.0

The library now owns its `"use client"` boundary. `setupReactSvg` no longer
generates components, so your configuration module stays server-safe: the pure
helpers run during a server render, and the svg map is no longer pulled into
the client bundle just by being configured.

Preloading a critical svg from a server-rendered `<head>` works now. It could
not in v2 — `getSvgUrl` was necessarily a client reference, and calling one
during a server render throws.

See [Migrating to v3](./README.md#migrating-to-v3) for the upgrade.

### Breaking

- **`<SvgProvider>` requires a `config` prop.** Nothing is closed over on your
  behalf any more. Take `config` from `setupReactSvg`, or build one with
  `createSvgConfig`.
- **The provider no longer accepts loose options.** `svgMap`, `rootFolder`,
  `namespace` and `svgRenderers` are no longer props. This also removes two
  defects: an inline svg map produced a new config identity on every render and
  re-rendered every svg beneath the provider, and omitting every option
  silently produced an empty svg map that only failed at render time.
- **⚠️ `idPrefix` is renamed to `namespace`** — the one break that can pass
  unnoticed. TypeScript reports the old key as an excess property, but
  JavaScript silently ignores it: the namespace reverts to its default and every
  generated `<defs>` id changes, breaking anything that references those ids
  from outside the library. Grep for `idPrefix` before upgrading.
- **Custom renderers must be client code.** A renderer is a component, so it
  needs a `"use client"` module — but its own module is enough. The config that
  imports it stays server-safe, which is what lets one config module serve an
  entire RSC application.
- **⚠️ `SvgConfig` changed meaning.** It named a single svg map entry in v2 and
  names the whole resolved configuration in v3; the per-entry type is now
  `SvgEntry`. Code annotated `SvgConfig` keeps compiling against a different
  shape than it was written for.
- **Type renames.** `SetupReactSvgArgs` → `SvgOptions`. The renderer prop
  `svgData` → `entry`, and `folder` → `url`, already resolved.
- **`SvgProviderProps` lost its second type parameter.** Renderers come from the
  config rather than from props, so `SvgProviderProps<Map, RenderMap>` becomes
  `SvgProviderProps<Map>`.
- **Removed exports:** `SvgElementArgs`, `SvgGroup` and `SvgGroupProps`.
  `SvgGroup` was a type; the component behind it was never exported.

### Added

- `setupReactSvg` returns the resolved `config` alongside the components.

### Changed

- `setupReactSvg` creates nothing at runtime. It returns this package's own
  `Svg` and `SvgProvider`, narrowed to your svg map — which is what keeps them
  addressable as client references across the RSC boundary.

### Unchanged

- Rendering behaviour. Svg content is still fetched and inserted on the client
  after hydration; the `<defs>` block is still empty in the initial HTML.
