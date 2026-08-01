"use client"

import { memo, useEffect } from "react"
import { getSvgId } from "../_shared/getSvgId"
import { useSvgConfig } from "../config/SvgConfigContext"
import type { SvgMap, SvgRendererProps } from "../config/types"
import { useLinkedSvgLoaded, useLinkSvg } from "../functions/useSvgLoaded"
import { BaseSvg } from "./BaseSvg"

export type LinkedSvgProps<SvgMapT extends SvgMap = SvgMap> =
	SvgRendererProps<SvgMapT>

/**
 * The `type="link"` render: registers the svg with the surrounding
 * `<SvgProvider />`, which fetches it once into a `<defs>` block, and points a
 * `<use>` at it. Rendering the same svg twice only costs one request and one
 * copy of the markup.
 *
 * An adapter at the renderer seam. It reads the namespace from context rather
 * than taking it as a prop, which is the capability a consumer renderer does
 * not have — the props are identical. See docs/adr/0004.
 */
export const LinkedSvg = memo(
	({
		svg,
		entry,
		alt,
		onLoad,
		// The markup is fetched once by the provider, not here, and neither value
		// belongs on the `<svg>` element.
		url: _url,
		loading: _loading,
		...rest
	}: LinkedSvgProps) => {
		const { namespace } = useSvgConfig()
		const key = String(svg)

		const linkSvg = useLinkSvg(namespace)
		const loaded = useLinkedSvgLoaded(namespace, key)

		useEffect(() => {
			linkSvg(key)
		}, [linkSvg, key])

		useEffect(() => {
			if (!onLoad || !loaded) return
			onLoad()
		}, [onLoad, loaded])

		return (
			<BaseSvg {...rest} entry={entry} alt={alt}>
				<use x="0" y="0" href={`#${getSvgId(namespace, key)}`} />
			</BaseSvg>
		)
	},
)

LinkedSvg.displayName = "LinkedSvg"
