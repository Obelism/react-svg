import React from "react"
import { memo } from "react"
import useSWR from "swr"
import { SWRConfig } from "../config/SWRConfig"
import type { SvgMap } from "../config/types"

import { formatSvgPath } from "../functions/formatSvgPath"
import { svgFetcher } from "../functions/svgFetcher"
import { useSetLinkedSvgLoaded } from "../functions/useSvgLoaded"

export type SvgGroupProps<SvgMapT extends SvgMap> = {
	svg: keyof SvgMapT
	[x: string]: any
}

export type SvgGroup<SvgMapT extends SvgMap> = React.MemoExoticComponent<
	({ svg, ...rest }: SvgGroupProps<SvgMapT>) => React.JSX.Element | null
>

export const svgGroupGenerator = <SvgMapT extends SvgMap>(
	svgMap: SvgMapT,
	rootFolder?: string,
) => {
	const SvgGroup = memo(({ svg, ...rest }: SvgGroupProps<SvgMapT>) => {
		const setLinkedSvgLoaded = useSetLinkedSvgLoaded(String(svg))
		const { data, error } = useSWR(
			svgMap[svg].path || formatSvgPath<SvgMapT>(svg, rootFolder),
			svgFetcher,
			{ ...SWRConfig, onSuccess: setLinkedSvgLoaded },
		)

		if (!data || error) return null

		return <g {...rest} dangerouslySetInnerHTML={{ __html: data }} />
	})

	SvgGroup.displayName = "SvgGroup"

	return SvgGroup
}
