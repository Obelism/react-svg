"use client"

import { setupReactSvg } from "@obelism/react-svg"
import type React from "react"

const SVG_MAP = {
	vercel: { width: 283, height: 64 },
	next: { width: 394, height: 80 },
}

// Custom renderers are functions, so they can't cross the RSC boundary: a
// config that carries them has to be built inside a client module.
const {
	SvgProvider: Provider,
	Svg: SvgComponent,
	config,
} = setupReactSvg({
	rootFolder: "/",
	svgMap: SVG_MAP,
	svgRenderers: {
		// A render type composed from a built-in one: the svg as a file, wrapped
		// in a link to that file. Renderers get everything they need as props, so
		// they never have to reach for the config themselves.
		externalLink: ({ svg, url, alt, ...rest }) => (
			<a
				href={url}
				target="_blank"
				rel="noreferrer"
				title={`Open ${String(svg)}.svg`}
			>
				<SvgComponent {...rest} svg={svg} type="external" alt={alt} />
			</a>
		),
	},
})

/**
 * Because this module is client-only, `config` is a client reference and the
 * server layout can't read it as a value. Wrapping the provider here keeps the
 * config on the side of the boundary where it was built.
 *
 * A config without custom renderers has no such problem — see `svg-config.ts`,
 * which a server component hands straight to `<SvgProvider />`.
 */
export const SvgProvider = ({ children }: { children?: React.ReactNode }) => (
	<Provider config={config}>{children}</Provider>
)

export const Svg = SvgComponent
