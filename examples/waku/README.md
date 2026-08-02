# Waku example

Exercises `@obelism/react-svg` across every React server component boundary,
from a **single config module**:

| Where | What it covers |
| --- | --- |
| `src/svg-config.ts` | The whole configuration, in a server-safe module — `setupReactSvg` with a custom renderer, and no `"use client"` |
| `src/pages/_layout.tsx` | `getSvgUrl` called during a **server** render for a preload link, and the one `<SvgProvider />` the app has |
| `src/pages/index.tsx` | Every render type — including the custom one — rendered from a **server component** |
| `src/components/PlainSvgDemo.tsx` | The same config's `Svg` inside a **client component**, with no provider of its own |
| `src/components/FramedSvg.tsx` | The custom renderer — a component, so it is the only file here that needs `"use client"` |

```sh
npm install
npm run dev
```

The `resolve` settings in `waku.config.ts` are only needed because this example
links the library from the repo root (`file:../..`) rather than installing it
from npm — see the comments there. Installing the published package needs no
Vite configuration at all.
