import React, { FC } from 'react'
import { SvgObj } from 'utils/types'

interface SvgImage {
	svgData: SvgObj
	loading?: 'lazy' | 'eager'
	[key: string]: any
}

export const SvgImage: FC<SvgImage> = ({
	svgData,
	loading = 'lazy',
	...rest
}) => (
	<img
		{...rest}
		style={{
			aspectRatio: `${svgData.width}/${svgData.height}`,
			position: 'relative',
		}}
		alt={svgData?.alt || ''}
		src={svgData.path}
		loading={loading}
	/>
)
