"use client"

import { memo, useEffect, useRef } from "react"
import type { SvgMap, SvgRendererProps } from "../config/types"

export type SvgImageProps<SvgMapT extends SvgMap = SvgMap> =
	SvgRendererProps<SvgMapT>

/**
 * The `type="external"` render: a plain lazy loaded `<img>` that reserves the
 * right aspect ratio from the svg map so it never causes a layout shift.
 *
 * An adapter at the renderer seam — the same props a consumer renderer gets.
 * See docs/adr/0004.
 */
export const SvgImage = memo(
	({
		// Destructured to keep it out of `rest`; `<img>` has no `svg` attribute.
		svg: _svg,
		url,
		entry,
		loading = "lazy",
		alt,
		style,
		onLoad,
		...rest
	}: SvgImageProps) => {
		const imgRef = useRef<HTMLImageElement>(null)

		useEffect(() => {
			if (imgRef?.current?.complete && onLoad) onLoad()
		}, [onLoad])

		// A plain <img> on purpose: the external render type exists to hand the
		// svg to the browser as a file. Framework image components re-encode and
		// proxy raster images, which an svg neither needs nor survives intact.
		return (
			<img
				{...rest}
				onLoad={onLoad}
				ref={imgRef}
				style={{
					aspectRatio: `${entry.width}/${entry.height}`,
					position: "relative",
					...style,
				}}
				alt={alt || entry?.alt || ""}
				src={url}
				loading={loading}
			/>
		)
	},
)

SvgImage.displayName = "SvgImage"
