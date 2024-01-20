import React, { memo } from 'react'

import { SvgElementArgs, SvgMap } from '../config/types'

import { formatSvgPath } from '../functions/formatSvgPath'

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
			loading = 'lazy',
			alt,
			...rest
		}: SvgElementArgs<SvgMapT>) => (
			<img
				{...rest}
				style={{
					aspectRatio: `${svgData.width}/${svgData.height}`,
					position: 'relative',
				}}
				alt={alt || svgData?.alt || ''}
				src={svgData.path || formatSvgPath<SvgMapT>(svg, folder)}
				loading={loading}
			/>
		),
	)

	SvgImage.displayName = 'SvgImage'

	return SvgImage
}
