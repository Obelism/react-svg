import React, { FC } from 'react'
import { CompleteSvgObj } from 'utils/types'

interface SvgImage {
	svgData: CompleteSvgObj
	loading?: 'lazy' | 'eager'
	[key: string]: any
}

export const SvgImage: FC<SvgImage> = ({
	svgData,
	loading = 'lazy',
	alt,
	...rest
}) => (
	<img
		{...rest}
		style={{
			aspectRatio: `${svgData.width}/${svgData.height}`,
			position: 'relative',
		}}
		alt={alt || svgData?.alt || ''}
		src={svgData.path}
		loading={loading}
	/>
)
