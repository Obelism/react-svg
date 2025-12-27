import React from "react"
import { memo, useEffect, useRef } from "react"
import type { JSX } from "react/jsx-dev-runtime"

import type { SvgElementArgs, SvgMap } from "../config/types"

import { formatSvgPath } from "../functions/formatSvgPath"

export type SvgImage<SvgMapT extends SvgMap> = React.MemoExoticComponent<
	(args: SvgElementArgs<SvgMapT>) => JSX.Element | null
>

export const svgImageGenerator = <
	SvgMapT extends SvgMap,
>(): SvgImage<SvgMapT> => {
	const SvgImage = memo(
		({
			svg,
			folder,
			svgData,
			loading = "lazy",
			alt,
			style,
			onLoad,
			...rest
		}: SvgElementArgs<SvgMapT>) => {
			const imgRef = useRef<HTMLImageElement>(null)

			useEffect(() => {
				if (imgRef?.current?.complete && onLoad) onLoad()
			}, [onLoad])

			return (
				<img
					{...rest}
					onLoad={onLoad}
					ref={imgRef}
					style={{
						aspectRatio: `${svgData.width}/${svgData.height}`,
						position: "relative",
						...style,
					}}
					alt={alt || svgData?.alt || ""}
					src={svgData.path || formatSvgPath<SvgMapT>(svg, folder)}
					loading={loading}
				/>
			)
		},
	)

	SvgImage.displayName = "SvgImage"

	return SvgImage
}
