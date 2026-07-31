"use client"

import { createSvgConfig, Svg, SvgProvider } from "@obelism/react-svg"

const SVG_MAP = {
	globe: { width: 16, height: 16, alt: "Globe" },
	window: { width: 16, height: 16, alt: "Window" },
}

// Built once at module scope. A config created inside the component would be a
// new object on every render, and every svg below would re-render with it.
const svgConfig = createSvgConfig({
	svgMap: SVG_MAP,
	rootFolder: "/svgs",
	namespace: "_plain",
})

/** The package components used inside a client component. */
export const PlainSvgDemo = () => (
	<SvgProvider config={svgConfig}>
		<h2>Plain components, configured in a client component</h2>
		<Svg svg="globe" type="link" data-testid="client-link" width={32} />
		<Svg svg="window" type="inline" data-testid="client-inline" width={32} />
		<Svg svg="globe" type="external" data-testid="client-external" width={32} />
	</SvgProvider>
)
