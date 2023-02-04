import React, { FC } from 'react'
import { IconObj } from 'utils/types'

interface IconImage {
	iconData: IconObj
	loading?: 'lazy' | 'eager'
	[key: string]: any
}

export const IconImage: FC<IconImage> = ({
	iconData,
	loading = 'lazy',
	...rest
}) => (
	<img
		{...rest}
		style={{
			aspectRatio: `${iconData.width}/${iconData.height}`,
			position: 'relative',
		}}
		alt={iconData?.alt || ''}
		src={iconData.path}
		loading={loading}
	/>
)
