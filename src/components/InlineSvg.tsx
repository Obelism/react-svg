"use client"

import { memo, useEffect, useRef } from "react"

import type { SvgMap, SvgRendererProps } from "../config/types"
import { BaseSvg } from "./BaseSvg"
import { SvgGroup } from "./SvgGroup"

export type InlineSvgProps<SvgMapT extends SvgMap = SvgMap> =
	SvgRendererProps<SvgMapT>

/**
 * The `type="inline"` render: the svg contents are fetched and inlined in this
 * component, so every node inside it can be targeted individually.
 *
 * An adapter at the renderer seam — it receives exactly the renderer props, the
 * same ones a consumer renderer gets. See docs/adr/0004.
 */
export const InlineSvg = memo(
	({
		// The linked set is not involved in an inline render, so the key is not
		// needed — only the url to fetch.
		svg: _svg,
		entry,
		url,
		alt,
		onLoad,
		// Inline renders have nothing to lazy-load, and `<svg>` has no `loading`
		// attribute — so it is dropped rather than passed through with `rest`.
		loading: _loading,
		...rest
	}: InlineSvgProps) => {
		const hasLoaded = useRef<boolean>(false)

		useEffect(() => {
			if (!onLoad || hasLoaded.current) return
			hasLoaded.current = true
			onLoad()
		}, [onLoad])

		return (
			<BaseSvg {...rest} entry={entry} alt={alt}>
				<SvgGroup url={url} />
			</BaseSvg>
		)
	},
)

InlineSvg.displayName = "InlineSvg"
