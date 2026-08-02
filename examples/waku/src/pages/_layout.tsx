import type { ReactNode } from "react"
import { preload } from "react-dom"

import { getSvgUrl, SvgProvider, svgConfig } from "../svg-config"

type RootLayoutProps = { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	// getSvgUrl runs here, in a server component — that is the whole point of
	// keeping the config module free of "use client". React's preload() dedupes
	// and hoists into <head>; rendering a <link rel="preload"> by hand emits the
	// tag twice, once hoisted and once literally.
	preload(getSvgUrl("vercel"), { as: "fetch", crossOrigin: "anonymous" })

	return (
		<div>
			{/* One provider, at the root: every svg below it — server or client
			    rendered — reads this config from context. */}
			<SvgProvider config={svgConfig}>{children}</SvgProvider>
		</div>
	)
}

export const getConfig = async () => {
	return { render: "dynamic" } as const
}
