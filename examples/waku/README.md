# Waku example

Exercises `@obelism/react-svg` across every React server component boundary:

| Where | What it covers |
| --- | --- |
| `src/svg-config.ts` | Pure helpers (`createSvgConfig`, `resolveSvgUrl`) in a server-safe module |
| `src/pages/_layout.tsx` | `getSvgUrl` called during a **server** render, for a preload link |
| `src/pages/index.tsx` | `Svg` / `SvgProvider` imported straight from the package into a **server component** |
| `src/components/PlainSvgDemo.tsx` | The same components inside a client component, configured with provider props |
| `src/components/CustomRenderer.tsx` | `setupReactSvg` with custom renderers — functions, so it has to live in a `"use client"` module |

```sh
npm install
npm run dev
```

The `resolve` settings in `waku.config.ts` are only needed because this example
links the library from the repo root (`file:../..`) rather than installing it
from npm — see the comments there. Installing the published package needs no
Vite configuration at all.
