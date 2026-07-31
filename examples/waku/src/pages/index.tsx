import { formatSvgPath, Svg, SvgProvider } from "@obelism/react-svg"

import { CustomRendererDemo } from "../components/CustomRenderer"
import { PlainSvgDemo } from "../components/PlainSvgDemo"
import { getSvgUrl, svgConfig } from "../svg-config"

export default async function HomePage() {
	// Pure helpers, called during the server render
	const serverResolved = `${getSvgUrl("vercel")} ${formatSvgPath("next", "/svgs")}`

	return (
		<main>
			<title>react-svg on Waku</title>
			<h1>react-svg on Waku</h1>

			<p data-testid="server-helpers">{serverResolved}</p>

			<h2>Plain components, configured in a server component</h2>
			<SvgProvider config={svgConfig}>
				<Svg svg="vercel" type="link" data-testid="rsc-link" width={64} />
				<Svg svg="next" type="inline" data-testid="rsc-inline" width={64} />
				<Svg svg="next" type="external" data-testid="rsc-external" width={64} />
			</SvgProvider>

			<PlainSvgDemo />
			<CustomRendererDemo />
		</main>
	)
}

export const getConfig = async () => {
	return { render: "dynamic" } as const
}
