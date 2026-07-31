"use client"

import setupReactSvg from "@obelism/react-svg"

// Custom renderers are functions, so they can't cross the RSC boundary: a
// config that carries them has to be built inside a client module.
const { SvgProvider, Svg, config } = setupReactSvg({
	rootFolder: "/svgs",
	svgMap: {
		globe: { width: 16, height: 16, alt: "Globe" },
	},
	svgRenderers: {
		framed: ({ svg, folder, alt }) => (
			<span data-testid="custom-renderer" style={{ border: "1px solid" }}>
				<img src={`${folder}/${String(svg)}.svg`} alt={alt} width={32} />
			</span>
		),
	},
})

export const CustomRendererDemo = () => (
	<SvgProvider config={config}>
		<Svg svg="globe" type="framed" alt="Globe in a frame" />
	</SvgProvider>
)
