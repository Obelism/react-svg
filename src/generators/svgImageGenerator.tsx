import React from 'react'

import { SvgImage } from '../config/types'

import { formatSvgPath } from '../functions/formatSvgPath'

export const svgImageGenerator = (rootFolder: string | undefined) => {
	return ({ svg, svgData, loading = 'lazy', alt, ...rest }: SvgImage) => (
		<img
			{...rest}
			style={{
				aspectRatio: `${svgData.width}/${svgData.height}`,
				position: 'relative',
			}}
			alt={alt || svgData?.alt || ''}
			src={svgData.path || formatSvgPath(svg, rootFolder)}
			loading={loading}
		/>
	)
}
