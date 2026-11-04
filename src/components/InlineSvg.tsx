"use client"

import { memo, useCallback, useRef } from "react"

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
		// A ref keeps a new `onLoad` per render from breaking SvgGroup's memo. Set
		// during render because SvgGroup's effect runs before any of ours.
		const onLoadRef = useRef(onLoad)
		onLoadRef.current = onLoad

		const loadedUrl = useRef<string | null>(null)

		const handleLoaded = useCallback(() => {
			if (loadedUrl.current === url) return
			loadedUrl.current = url
			onLoadRef.current?.()
		}, [url])

		return (
			<BaseSvg {...rest} entry={entry} alt={alt}>
				<SvgGroup url={url} onLoaded={handleLoaded} />
			</BaseSvg>
		)
	},
)

InlineSvg.displayName = "InlineSvg"
