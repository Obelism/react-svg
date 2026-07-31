# React SVG

> A performant way to load and show SVG in React applications.

<p>
    <a aria-label="NPM version" href="https://www.npmjs.com/package/@obelism/react-svg">
        <img alt="" src="https://badgen.net/npm/v/@obelism/react-svg">
    </a>
    <a aria-label="Package size" href="https://bundlephobia.com/result?p=@obelism/react-svg">
        <img alt="" src="https://badgen.net/bundlephobia/minzip/@obelism/react-svg">
    </a>
    <a aria-label="License" href="https://github.com/Obelism/react-SVG/blob/main/LICENSE">
        <img alt="" src="https://badgen.net/npm/license/@obelism/react-svg">
    </a>
</p>

The concept is to provide a minimal API to render SVGs without needing to convert them to React components. This library support three ways to show SVGs;

- **Image**, it uses an image element to lazy load the SVG while provider the correct aspect ratio at all times. The most performant way of loading but doesn't give any context to the loaded SVG.
- **Reference**, Using a global definition. This lazy loads the SVG in the provider and makes it possible to reference it in multiple places. This has the advantage of having the SVG in the DOM once and displaying it multiple times. This still works with contextual properties like; `fill: currentColor` in multiple places. A good middle ground between performance and control.
- **Inline**, When specific parts of the SVG need to be controlled, nothing beats inlining the SVG. However with that comes the drawback that when

## Quick start

```ts
// app/svg-config.ts — an ordinary module, no "use client" needed
import setupReactSvg from '@obelism/react-svg'

export const { SvgProvider, Svg, config } = setupReactSvg({
	svgMap: {
		arrowBack: {
			path: '/SVGs/arrow-back.svg',
			width: 800,
			height: 800,
			x: 0,
			y: 0,
			alt: 'Back arrow',
		},
	},
})
```

In the initialization there needs to be an object of all SVGs that you support. This is a key/value object with path, viewbox info and alt tag. This gives you back the two components, the resolved `config`, and [`getSvgUrl`](#getsvgurl).

Nothing is created here — `setupReactSvg` hands back the components this package already exports, narrowed to your svg map. That is what lets this file stay server-safe: it holds plain data, so a server component can import from it, and only the components themselves cross into the browser.

Pass the `config` to the provider, and it reaches every `Svg` below it. Then on each SVG you say which one to show and how to load it; `link`, `external` or `inline`.

```tsx
<SvgProvider config={config}>
    <header>
        <a href='/previous'>
            <Svg type="link" svg='arrowBack' />
            Back to overview
        </a>
    </header>

    <main>...</main>

    <footer>
        <a href='/previous'>
            <Svg type="link" svg='arrowBack' />
            Previous article
        </a>

        <a href='/next'>
            <span className="flipped">
                <Svg type="link" svg='arrowBack' alt="Forward arrow" />
            </span>
            Next article
        </a>
    </footer>
</SvgProvider>
```

Upgrading from v2? See [migrating to v3](#migrating-to-v3).

## API

This library consist of three parts; a provider, a consumer and the setup that binds both to your configuration.

### setupReactSvg

```ts
export const { SvgProvider, Svg, getSvgUrl } = setupReactSvg({
    svgMap: {...},
    rootFolder: "/images/icons",
    namespace: "🦦",
    svgRenderers: {...}
})
```

`setupReactSvg` creates nothing. It returns the very same `Svg` and `SvgProvider` this package exports, narrowed to one svg map so your keys and custom render types autocomplete without repeating the configuration at every call site. Next to the two components it returns [`getSvgUrl`](#getsvgurl) and the resolved `config`, which the provider needs and which you can hand to any component yourself (see [using the components directly](#using-the-components-directly)).

Because it only narrows types, the components stay ordinary module exports — which is what keeps them usable across the React server component boundary. See [React server components](#react-server-components--nextjs-app-router--waku).

Accepted arguments;

#### svgMap

```ts
...
svgMap: {
    arrowBack: {
        path: '/SVGs/arrow-back.svg',
        width: 800,
        height: 800,
        x: 0,
        y: 0,
        alt: 'Back arrow',
    },
},
...
```

This is the key/value store for all SVGs you want in your application. The provided key is used to load it using the component. It supports the following options;

- `path` {string} - Path of the SVG, optional when the rootFolder is set
- `width` {number} - Viewbox width of the SVG
- `height` {number} - Viewbox height of the SVG
- `x` {number} - (optional) Horizontal start position of the SVG Viewbox
- `y` {number} - (optional) Vertical start position of the SVG Viewbox
- `alt` {string} - (optional) SVG alt text, can be left empty for decorative usage

#### rootFolder

```ts
...
rootFolder: "/images/icons",
...
```

When having most SVGs in the same folder this feature can be used skip having to set a path for each SVG. For example when setting this value to; `/images/icons`. It would automatically generate the path for the `arrowBack` like this; `/images/icons/arowBack.svg`.

#### namespace

```ts
...
namespace: "🦦",
...
```

To make references to the loaded SVGs we make use of ids. By default these are prefixed by; `_RI`. So for the the `arrowBack` the id would be; `_RI-arrowBack`. However if this gives problems in your application or you want to add some flair you can modify this to any string; `🦦-arrowBack`.

#### svgRenderers

An optional argument for your own custom render functions. This is convenient to be used in meta frameworks like NextJS if you want to utilize their Image components.

```tsx
...
svgRenderers: {
    'custom-image': ({ svg, folder, alt }) => (
        <div id="customElement">
            <img src={formatSvgPath(svg, folder)} alt={alt} />
        </div>
    )
}
...
```

### SvgProvider

```tsx
<SvgProvider config={config} />
```

This is the provider that keeps track of the context for the Svgs that use the `type="link"`. This contains the context provider and a hidden SVG that has the SVG `<defs>`.

`config` is required and is the only prop besides `children`. Take it from `setupReactSvg`, or build one with [`createSvgConfig`](#using-the-components-directly). Build it once, at module scope — a config created inline is a new object on every render, and every `Svg` below the provider re-renders with it.

If you're only using `inline` and `external` you can skip the provider entirely and pass `config` straight to each `Svg`, though see the cost noted in [using the components directly](#using-the-components-directly).

### Svg

```tsx
<Svg type="link" svg="arrowBack" alt="Forward arrow" />
```

This is the primitive component that can be used to show the SVG. It will either render a; `<img />` for when the type is external or a `<svg>` for when the type is `link` or `inline`. For each type of rendering extra props can be passed to be used as html attributes; `className`, `style`, `data-*`, etc.

Specific arguments;

#### type

Type of rendering the SVG;

- `external` - Renders an image tag and links to the path of the SVG
- `link` (default) - Lazy loads the SVG in the provider and links it up using the id.
- `inline` - Lazy loads the SVG in the component

#### svg

Key of the SVF to be rendered. This value needs to match up with a key you passed as a singular SVG entry in the `setupReactSvg`.

#### loading

Specifically for when using `external`. This library relies on the [loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading#images_and_iframes) attribute for images. The default behavior that we pass is `lazy`. For above the fold SVGs it's recommended to use `eager`.

### getSvgUrl

```ts
getSvgUrl('arrowBack') // => '/SVGs/arrow-back.svg'
```

Resolves the same URL this library itself would fetch for a given `svg` key — the entry's `path` if set, otherwise `rootFolder` plus the generated filename. Useful anywhere you need the raw URL outside of a `Svg` component, e.g. to [preload a critical icon](#preloading-critical-icons). Throws if the key isn't in `svgMap`.

### Using the components directly

`Svg` and `SvgProvider` are plain React components, exported from the package. `setupReactSvg` is a convenience on top of them, not a requirement — build the config yourself with `createSvgConfig` and everything below the provider works the same:

```tsx
import { createSvgConfig, resolveSvgUrl, Svg, SvgProvider } from '@obelism/react-svg'

const SVG_MAP = {
	arrowBack: { path: '/SVGs/arrow-back.svg', width: 800, height: 800, alt: 'Back arrow' },
}

export const svgConfig = createSvgConfig({ svgMap: SVG_MAP, rootFolder: '/images/icons' })

const App = () => (
	<SvgProvider config={svgConfig}>
		<Svg svg="arrowBack" type="link" />
	</SvgProvider>
)

resolveSvgUrl(svgConfig, 'arrowBack') // => '/SVGs/arrow-back.svg'
```

Build the config at module scope, the same way you would with any other context value — the components use its identity to skip re-renders.

A single `Svg` can also render with no provider at all, by taking the `config` directly:

```tsx
<Svg svg="arrowBack" type="inline" config={svgConfig} />
```

**This is an escape hatch, not the normal path.** It exists for isolated usage, tests and stories. Under React server components the config is serialized into the payload *once per element that carries it*, so a whole page of them ships your entire svg map that many times over. The provider serializes it once. Reach for the prop when there is no provider to reach for, not to avoid adding one.

Both ways keep the svg keys typed; `config` is inferred, so `svg="typoo"` is still a type error.

`Svg` and `SvgProvider` are the only components the package exports. The pieces each render type is built out of stay internal, so their props are free to change without a major version — a custom renderer is handed everything it needs as props, so there is nothing to reach past them for.

## Why?

✨ SVGs are awesome ✨. However using them in React can be a crappy experience without the right tools. Changing every `fill-rule` to `fillRule` is not that fun. And at the same time this adds bundle size and increases the initial document when using SSG or SSG. But sometimes you do need that flexibility for animations. The goal with this library is to load SVGs in the most performant way and giving the flexibility to switch without having to refactor a lot. To keep the API minimal the functionality is also limited, for full control options like [react-svg](https://www.npmjs.com/package/react-svg) might be a better fit.

## Notes

### Security

The `link` and `inline` render types fetch the raw SVG file contents and insert them into the DOM as markup (needed to make `fill`/`stroke` etc. controllable via CSS, and to support `<use>` references). Only point `svgMap` paths / `rootFolder` at SVGs you control and trust (bundled assets, your own CDN) — never at user-uploaded or otherwise untrusted SVG content, since a malicious SVG can include `<script>` tags or event handler attributes. The `external` render type (a plain `<img>`) does not have this risk, since browsers don't execute scripts inside image-loaded SVGs.

### Preloading critical icons

For the `link` and `inline` types, the SVG content is always fetched over the network before there's anything to paint — so an above-the-fold icon (a logo, a nav icon) can show up empty for a moment on a cold page load while that fetch resolves. Thanks to the SWR cache (`revalidateIfStale: false`), this only affects the *first* time a given icon is requested in a browser session — every later mount of that same icon resolves from cache instantly.

To avoid the empty first paint for a specific icon, warm the browser's HTTP cache before this library requests it, using a preload link tag. Use [`getSvgUrl`](#getsvgurl) to build the `href` so it always matches whatever this library actually fetches, instead of hand-writing (and potentially drifting from) the path yourself:

```tsx
<link rel="preload" as="fetch" crossOrigin="anonymous" href={getSvgUrl('logo')} />
```

The `crossOrigin` attribute is required, even for same-origin paths — `fetch()` always makes a CORS request, and the browser will only reuse a preload for a matching request mode. Without it the preload is fetched but ignored, and this library's `fetch()` call re-requests it.

Under React server components, build the URL in a module *without* `"use client"` so it can actually run during the server render — see [React server components](#react-server-components--nextjs-app-router--waku):

```tsx
// app/svg-config.ts — no "use client"
import setupReactSvg from "@obelism/react-svg"

export const { SvgProvider, Svg, config, getSvgUrl } = setupReactSvg({
	svgMap: { ... },
	rootFolder: "/icons",
})
```

In a React 19 tree — which includes the Next.js App Router — reach for `preload` from `react-dom` rather than rendering the tag yourself. It hoists into `<head>` and deduplicates:

```tsx
// app/layout.tsx
import { preload } from "react-dom"
import { getSvgUrl } from "./svg-config"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	preload(getSvgUrl('logo'), { as: 'fetch', crossOrigin: 'anonymous' })

	return (
		<html>
			<body>{children}</body>
		</html>
	)
}
```

Rendering a `<link rel="preload">` element by hand works too, but React emits the tag **twice** — once hoisted as a resource and once literally — so prefer `preload()` where you have it. (It renders `crossorigin=""`, which is the same anonymous state as `crossorigin="anonymous"`.)

Only do this for a handful of critical, above-the-fold icons — preloading everything defeats the point of `link`/`inline` lazily fetching icons on demand. For a purely instant first paint regardless of caching, `type="external"` (a plain `<img>`) avoids the JS fetch step entirely, since the browser's preload scanner can pick it up on its own.

### Types

The package exports its own types — `SvgProps`, `SvgProviderProps`, `SvgEntry`, `SvgMap`, `SvgRenderer`, `SvgConfig`, and so on. Those are generic over your svg map though, so for the components bound to *your* configuration it's easiest to let Typescript read them off:

```ts
const { SvgProvider, Svg } = setupReactSvg({ ... });

export type SvgProps = React.ComponentProps<typeof Svg>;
```

This will then give you the type with all your provided Svg options and custom renderers.

### React server components / NextJS App router / Waku

The components use context and client side fetching, so they're client components. The package ships them as `"use client"` modules, which means you can import and render them straight from a server component — no wrapper module of your own needed:

```tsx
// app/page.tsx — a server component
import { Svg, SvgProvider } from "@obelism/react-svg"
import { svgConfig } from "./svg-config"

export default function Page() {
	return (
		<SvgProvider config={svgConfig}>
			<Svg svg="arrowBack" type="link" />
		</SvgProvider>
	)
}
```

The configuration crosses the server/client boundary as a prop, so it has to be serializable. `svgMap`, `rootFolder` and `namespace` are plain data and pass through fine. `svgRenderers` are **functions**, which can't be serialized — a config that carries custom renderers has to be built inside a `"use client"` module.

`createSvgConfig`, `resolveSvgUrl` and `formatSvgPath` are pure and ship outside the client boundary, so they run on either side:

```ts
// app/svg-config.ts — deliberately no "use client"
import { createSvgConfig, resolveSvgUrl } from "@obelism/react-svg"

export const SVG_MAP = { arrowBack: { width: 800, height: 800 } }
export const svgConfig = createSvgConfig({ svgMap: SVG_MAP, rootFolder: "/icons" })
export const getSvgUrl = (svg: keyof typeof SVG_MAP) => resolveSvgUrl(svgConfig, svg)
```

`setupReactSvg` is pure too — it resolves the config and narrows types, and creates nothing — so it belongs in the same server-safe module:

```ts
// app/svg-config.ts — deliberately no "use client"
import setupReactSvg from "@obelism/react-svg"

export const { SvgProvider, Svg, config, getSvgUrl } = setupReactSvg({
	svgMap: { arrowBack: { width: 800, height: 800 } },
	rootFolder: "/icons",
})

// and this now works during a server render:
// <link rel="preload" as="fetch" href={getSvgUrl("arrowBack")} />
```

The one thing that does force a `"use client"` module is **custom renderers**, since they are functions and functions cannot be serialized across the boundary. Put the config that carries them in a client module — and note that `config` then becomes a client reference itself, so a server component can't read it. Wrap the provider in that module instead of exporting the config out of it.

Do **not** re-export `getSvgUrl` from a `"use client"` module and call it in a server component. Every export of such a module becomes a client reference, and calling one during a server render throws (`It is not possible to invoke a client function from the server`). Keep the URL helpers in a server-safe module, as above. This was the main thing v2 made impossible.

Two providers that share a `namespace` also share their `<defs>` ids, so give each configuration its own `namespace` when you use more than one in a page.

Both patterns are exercised end to end in [`examples/next`](examples/next) and [`examples/waku`](examples/waku).

## Migrating to v3

v3 stops generating components. `setupReactSvg` used to build a new `Svg` and `SvgProvider` around your configuration; now it hands back the package's own components with their types narrowed. That is what lets this package own its `"use client"` boundary instead of pushing it into your code — and it is why `getSvgUrl` finally works during a server render.

For most applications the upgrade is two lines.

### 1. Pass the config to the provider

Nothing is closed over on your behalf any more, so the provider needs the config:

```diff
- export const { SvgProvider, Svg } = setupReactSvg({ svgMap })
+ export const { SvgProvider, Svg, config } = setupReactSvg({ svgMap })

- <SvgProvider>{children}</SvgProvider>
+ <SvgProvider config={config}>{children}</SvgProvider>
```

The provider no longer accepts `svgMap` / `rootFolder` / `namespace` / `svgRenderers` as separate props. Build a config with `createSvgConfig` and pass that instead.

### 2. Drop `"use client"` from your config module

If you added it only so `setupReactSvg` could be called, remove it — the module is now plain data and a server component can import from it. Keep it only if the module declares custom renderers.

### 3. Move custom renderers into a client module

Renderers are functions, and functions cannot cross the server/client boundary as serialized data. A config carrying them has to be built inside a `"use client"` module. React will tell you if you get this wrong, but the error names serialization rather than renderers, so it is worth knowing up front.

### 4. `idPrefix` is now `namespace`

```diff
  setupReactSvg({
    svgMap,
-   idPrefix: '🦦',
+   namespace: '🦦',
  })
```

⚠️ **This is the one change that can pass silently.** In TypeScript the old key is an excess property and you get a compile error pointing straight at it. In JavaScript nothing is raised at all: the unknown option is ignored, the namespace falls back to its default, and every generated `<defs>` id changes. Anything referencing those ids from outside the library — stylesheets, end-to-end selectors, snapshots — breaks with nothing pointing at the cause. Grep for `idPrefix` before upgrading.

### 5. Renamed and removed types

`SvgConfig` used to mean a single entry in your svg map; it now means the whole resolved configuration. The per-entry type is `SvgEntry`.

| v2 | v3 |
| --- | --- |
| `SvgConfig` (one entry) | `SvgEntry` |
| `ResolvedSvgConfig` | `SvgConfig` |
| `SetupReactSvgArgs` | `SvgOptions` |
| `svgData` prop on renderers | `entry` |

`SvgProviderProps` also lost its second type parameter — renderers come from the config now, not from props — so `SvgProviderProps<Map, RenderMap>` becomes `SvgProviderProps<Map>`.

These exports are gone, all of them internals whose props were never a designed API: `BaseSvg`, `InlineSvg`, `LinkedSvg`, `SvgGroup`, `SvgImage` and their prop types, plus `getSvgId`, `formatSvgViewBox`, `SvgConfigContext`, `useSvgConfig` and `SvgElementArgs`. Custom renderers are handed everything they need as props, so there should be nothing to reach past `Svg` and `SvgProvider` for. If you were relying on one of them, please open an issue — the absence is deliberate, but the list can grow.

## Dependencies

- [react](https://www.npmjs.com/package/react) - For the JSX runtime, useContext and useEffect
- [swr](https://www.npmjs.com/package/swr) - Solution to fetch the SVG content and cache the response across components

## License

[MIT](LICENSE).
