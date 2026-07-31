"use client"

import { memo, useEffect, useRef } from "react"
import { formatSvgPath } from "../_shared/formatSvgPath"
import type { SvgElementArgs, SvgMap } from "../config/types"

export type SvgImageProps<SvgMapT extends SvgMap = SvgMap> =
	SvgElementArgs<SvgMapT>

/**
 * The `type="external"` render: a plain lazy loaded `<img>` that reserves the
 * right aspect ratio from the svg map so it never causes a layout shift.
 */
export const SvgImage = memo(
	({
		svg,
		folder,
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
				src={entry.path || formatSvgPath<SvgMap>(String(svg), folder)}
				loading={loading}
			/>
		)
	},
)

SvgImage.displayName = "SvgImage"
