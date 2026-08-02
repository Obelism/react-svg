import { formatSvgPath } from "@obelism/react-svg"

import { PlainSvgDemo } from "../components/PlainSvgDemo"
import { getSvgUrl, Svg } from "../svg-config"

export default async function HomePage() {
	// Pure helpers, called during the server render
	const serverResolved = `${getSvgUrl("vercel")} ${formatSvgPath("next", "/svgs")}`

	return (
		<main>
			<title>react-svg on Waku</title>
			<h1>react-svg on Waku</h1>

			<p data-testid="server-helpers">{serverResolved}</p>

			{/* A server component: no "use client" wrapper of our own, and no
			    provider of its own — the layout provides the config. */}
			<h2>Every render type, from a server component</h2>
			<Svg svg="vercel" type="link" data-testid="rsc-link" width={64} />
			<Svg svg="next" type="inline" data-testid="rsc-inline" width={64} />
			<Svg svg="next" type="external" data-testid="rsc-external" width={64} />
			{/* The custom render type, from the same config */}
			<Svg svg="globe" type="framed" alt="Globe in a frame" />

			<PlainSvgDemo />
		</main>
	)
}

export const getConfig = async () => {
	return { render: "dynamic" } as const
}
