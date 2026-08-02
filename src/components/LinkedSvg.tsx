"use client"

import { memo, useEffect } from "react"
import type { SvgMap, SvgRendererProps } from "../config/types"
import { useLinkedSvg } from "../functions/useLinkedSet"
import { BaseSvg } from "./BaseSvg"

export type LinkedSvgProps<SvgMapT extends SvgMap = SvgMap> =
	SvgRendererProps<SvgMapT>

/**
 * The `type="link"` render: adds the svg to the linked set, which the
 * surrounding `<SvgProvider />` fetches once into its definitions block, and
 * points a `<use>` at it. Rendering the same svg twice only costs one request
 * and one copy of the markup.
 *
 * An adapter at the renderer seam. Reaching the linked set is the capability a
 * consumer renderer does not have — the props are identical. See docs/adr/0004.
 */
export const LinkedSvg = memo(
	({
		svg,
		entry,
		alt,
		onLoad,
		// The markup is fetched by the definitions block, not here, and neither
		// value belongs on the `<svg>` element.
		url: _url,
		loading: _loading,
		...rest
	}: LinkedSvgProps) => {
		const { id, loaded, register } = useLinkedSvg(String(svg))

		useEffect(() => {
			register()
		}, [register])

		useEffect(() => {
			if (!onLoad || !loaded) return
			onLoad()
		}, [onLoad, loaded])

		return (
			<BaseSvg {...rest} entry={entry} alt={alt}>
				<use x="0" y="0" href={`#${id}`} />
			</BaseSvg>
		)
	},
)

LinkedSvg.displayName = "LinkedSvg"
