"use client"

import { memo, useEffect } from "react"
import { getSvgId } from "../_shared/getSvgId"
import { useSvgConfig } from "../config/SvgConfigContext"
import type { SvgConfig, SvgMap } from "../config/types"
import { useLinkedSvgLoaded, useLinkSvg } from "../functions/useSvgLoaded"
import { BaseSvg } from "./BaseSvg"

export type LinkedSvgProps<SvgMapT extends SvgMap = SvgMap> = {
	svg: keyof SvgMapT
	alt?: string
	onLoad?: () => void
	config?: SvgConfig<SvgMapT>
	// biome-ignore lint/suspicious/noExplicitAny: pass-through bag spread onto the <svg> element; unknown breaks JSX spreading (verified via tsc)
	[x: string]: any
}

/**
 * The `type="link"` render: registers the svg with the surrounding
 * `<SvgProvider />`, which fetches it once into a `<defs>` block, and points a
 * `<use>` at it. Rendering the same svg twice only costs one request and one
 * copy of the markup.
 */
export const LinkedSvg = memo(
	({ svg, alt, onLoad, config, ...rest }: LinkedSvgProps) => {
		const { svgMap, namespace } = useSvgConfig(config)
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

		const entry = svgMap[key]

		if (!entry) return null

		return (
			<BaseSvg {...rest} entry={entry} alt={alt}>
				<use x="0" y="0" href={`#${getSvgId(namespace, key)}`} />
			</BaseSvg>
		)
	},
)

LinkedSvg.displayName = "LinkedSvg"
