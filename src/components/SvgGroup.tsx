"use client"

import { memo } from "react"
import useSWR from "swr"
import { formatSvgPath } from "../_shared/formatSvgPath"
import { useSvgConfig } from "../config/SvgConfigContext"
import { SWRConfig } from "../config/SWRConfig"
import type { SvgConfig, SvgMap } from "../config/types"
import { svgFetcher } from "../functions/svgFetcher"
import { useSetLinkedSvgLoaded } from "../functions/useSvgLoaded"

export type SvgGroupProps<SvgMapT extends SvgMap = SvgMap> = {
	svg: keyof SvgMapT
	config?: SvgConfig<SvgMapT>
	// biome-ignore lint/suspicious/noExplicitAny: pass-through bag spread onto <g>; unknown breaks JSX spreading (verified via tsc)
	[x: string]: any
}

/**
 * Fetches the raw contents of a single svg file and drops them into a `<g>`.
 * Used both inline (inside a `<svg>`) and by the provider (inside `<defs>`).
 */
export const SvgGroup = memo(({ svg, config, ...rest }: SvgGroupProps) => {
	const { svgMap, rootFolder, namespace } = useSvgConfig(config)
	const key = String(svg)
	const setLinkedSvgLoaded = useSetLinkedSvgLoaded(namespace, key)

	const { data, error } = useSWR(
		svgMap[key]?.path || formatSvgPath<SvgMap>(key, rootFolder),
		svgFetcher,
		{ ...SWRConfig, onSuccess: setLinkedSvgLoaded },
	)

	if (!data || error) return null

	return (
		<g
			{...rest}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting fetched svg markup is what the inline and link render types are; the content is the svg file the consumer declared in their svg map, not user input
			dangerouslySetInnerHTML={{ __html: data }}
		/>
	)
})

SvgGroup.displayName = "SvgGroup"
