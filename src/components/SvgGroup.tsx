"use client"

import { memo, useEffect } from "react"
import useSWR from "swr"
import { SWRConfig } from "../config/SWRConfig"
import { svgFetcher } from "../functions/svgFetcher"

export type SvgGroupProps = {
	url: string
	onLoaded?: () => void
	// biome-ignore lint/suspicious/noExplicitAny: pass-through bag spread onto <g>; unknown breaks JSX spreading (verified via tsc)
	[x: string]: any
}

/**
 * Fetches the raw contents of one svg file and drops them into a `<g>`. Used
 * inline (inside a `<svg>`) and by the definitions block.
 *
 * Knows nothing but its url — not the svg config, not the linked set. The
 * definitions block passes `onLoaded`; an inline render passes nothing, so an
 * inline svg never reports a linked svg as loaded.
 */
export const SvgGroup = memo(({ url, onLoaded, ...rest }: SvgGroupProps) => {
	const { data, error } = useSWR(url, svgFetcher, SWRConfig)

	// Reports having the markup, not having fetched it. SWR serves a url it has
	// already loaded straight from cache without calling the fetcher, so an
	// `onSuccess` handler would miss exactly the case where the markup arrived
	// via some other render of the same svg.
	useEffect(() => {
		if (!data || error || !onLoaded) return
		onLoaded()
	}, [data, error, onLoaded])

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
