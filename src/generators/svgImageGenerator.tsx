import React from 'react'

import { SvgElement, SvgListT } from '../config/types'

import { formatSvgPath } from '../functions/formatSvgPath'

export const svgImageGenerator = <T extends SvgListT>(): SvgElement<T> => {
	return ({ svg, folder, svgData, loading = 'lazy', alt, ...rest }) => (
		<img
			{...rest}
			style={{
				aspectRatio: `${svgData.width}/${svgData.height}`,
				position: 'relative',
			}}
			alt={alt || svgData?.alt || ''}
			src={svgData.path || formatSvgPath<T>(svg, folder)}
			loading={loading}
		/>
	)
}
