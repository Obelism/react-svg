This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## `@obelism/react-svg`

The whole app runs on a **single config module**:

| Where | What it covers |
| --- | --- |
| `app/svg-config.ts` | The whole configuration, in a server-safe module — `setupReactSvg` with a custom renderer, and no `"use client"` |
| `app/layout.tsx` | `getSvgUrl` called during a **server** render for `preload()`, and the one `<SvgProvider />` the app has |
| `app/page.tsx` | Every render type — including the custom one — rendered from a **server component** |
| `app/client.tsx` | The same config's `Svg` inside a **client component**, with `onLoad` |
| `app/ExternalLinkSvg.tsx` | The custom renderer — a component, so it is the only file here that needs `"use client"` |
| `app/stress/` | Pages of 50 to 2000 svgs per render type (`/stress`), on a config of their own, timing how long they take to settle |
| `app/stress-svg/` | Generates the 2000 distinct svg files those pages link |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
