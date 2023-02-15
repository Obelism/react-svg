import React, { useContext, useEffect } from 'react'

import { SvgListT, SvgImage } from '../config/types'
import { SvgContext } from '../config/SvgContext'

import { GetSvgId } from '../functions/getSvgIdGenerator'
import { formatViewbox } from '../functions/formatViewbox'

/**
 * Generator
 */
export const svgGenerator = <T extends SvgListT>(
	svgs: T,
	SvgImage: ({ svg, svgData, loading, alt, ...rest }: SvgImage) => JSX.Element,
	SvgGroup: ({
		svg,
		...rest
	}: {
		[x: string]: any
		svg: keyof T
	}) => JSX.Element | null,
	getSvgId: GetSvgId,
) => {
	return ({
		type = 'link',
		svg,
		alt,
		...rest
	}: {
		type: 'external' | 'link' | 'inline'
		svg: keyof T
		[x: string]: any
	}) => {
		const linkSvg = useContext(SvgContext)

		useEffect(() => {
			if (type !== 'link') return
			linkSvg(String(svg))
		}, [linkSvg, svg])

		const svgData = svgs[svg]

		if (type === 'external')
			return <SvgImage {...rest} alt={alt} svg={svg} svgData={svgData} />

		return (
			<svg {...rest} viewBox={formatViewbox(svgData)} xmlSpace="preserve">
				{(alt || svgData.alt) && <title>{alt || svgData.alt}</title>}

				{type === 'inline' ? (
					<SvgGroup svg={svg} />
				) : (
					<use x="0" y="0" xlinkHref={`#${getSvgId(String(svg))}`} />
				)}
			</svg>
		)
	}
}
