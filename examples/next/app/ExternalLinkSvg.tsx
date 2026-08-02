"use client"

import { Svg, type SvgRendererProps } from "@obelism/react-svg"

import type { SVG_MAP } from "./svg-config"

/**
 * A render type composed from a built-in one: the svg as a file, wrapped in a
 * link to that file. Renderers get everything they need as props, so they never
 * have to reach for the config themselves — the `<Svg />` below reads it from
 * the provider it is rendered under.
 *
 * It lives in its own "use client" module so that `svg-config.ts` can stay
 * server-safe while still naming it.
 */
export const ExternalLinkSvg = ({
	svg,
	url,
	alt,
	entry: _entry,
	...rest
}: SvgRendererProps<typeof SVG_MAP>) => (
	<a
		href={url}
		target="_blank"
		rel="noreferrer"
		title={`Open ${String(svg)}.svg`}
	>
		<Svg {...rest} svg={svg} type="external" alt={alt} />
	</a>
)
