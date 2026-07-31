"use client"

import { memo, useEffect, useRef } from "react"

import { useSvgConfig } from "../config/SvgConfigContext"
import type { SvgConfig, SvgMap } from "../config/types"
import { BaseSvg } from "./BaseSvg"
import { SvgGroup } from "./SvgGroup"

export type InlineSvgProps<SvgMapT extends SvgMap = SvgMap> = {
	svg: keyof SvgMapT
	alt?: string
	onLoad?: () => void
	config?: SvgConfig<SvgMapT>
	// biome-ignore lint/suspicious/noExplicitAny: pass-through bag spread onto the <svg> element; unknown breaks JSX spreading (verified via tsc)
	[x: string]: any
}

/**
 * The `type="inline"` render: the svg contents are fetched and inlined in this
 * component, so every node inside it can be targeted individually.
 */
export const InlineSvg = memo(
	({ svg, alt, onLoad, config, ...rest }: InlineSvgProps) => {
		const resolvedConfig = useSvgConfig(config)
		const hasLoaded = useRef<boolean>(false)

		useEffect(() => {
			if (!onLoad || hasLoaded.current) return
			hasLoaded.current = true
			onLoad()
		}, [onLoad])

		const entry = resolvedConfig.svgMap[String(svg)]

		if (!entry) return null

		return (
			<BaseSvg {...rest} entry={entry} alt={alt}>
				<SvgGroup svg={svg} config={resolvedConfig} />
			</BaseSvg>
		)
	},
)

InlineSvg.displayName = "InlineSvg"
