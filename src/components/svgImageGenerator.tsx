import React, { FC } from 'react'

import { SvgT } from '../utils/types'
import { formatSvgPath } from '../utils/formatSvgPath'

interface SvgImage {
	svgData: SvgT
	loading?: 'lazy' | 'eager'
	[key: string]: any
}

export const svgImageGenerator = (rootFolder?: string): FC<SvgImage> => {
	return ({ svg, svgData, loading = 'lazy', alt, ...rest }) => (
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
