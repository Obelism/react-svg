import React, { useContext, useEffect } from 'react'

import { SvgListT, ElementMap, SvgElement } from '../config/types'
import { SvgContext } from '../config/SvgContext'

import { GetSvgId } from '../functions/getSvgIdGenerator'
import { formatViewbox } from '../functions/formatViewbox'

/**
 * Generator
 */
export const svgGenerator = <T extends SvgListT, E extends ElementMap<T>>(
	svgs: T,
	SvgGroup: ({
		svg,
		...rest
	}: {
		[x: string]: any
		svg: keyof T
	}) => JSX.Element | null,
	getSvgId: GetSvgId,
	SvgImage: SvgElement<T>,
	renderers?: E,
	rootFolder?: string,
) => {
	return ({
		type = 'link',
		svg,
		alt,
		loading,
		...rest
	}: {
		type: 'link' | 'inline' | 'external' | keyof E
		svg: keyof T
		loading?: 'lazy' | 'eager'
		[x: string]: any
	}) => {
		const linkSvg = useContext(SvgContext)

		useEffect(() => {
			if (type !== 'link') return
			linkSvg(String(svg))
		}, [linkSvg, svg])

		const svgData = svgs[svg]

		if (!svgData) {
			if (process.env.NODE_ENV !== 'production')
				throw new Error(
					`Unknown svg provided; "${String(
						svg,
					)}", check your setupReactSvg(...)`,
				)
			return null
		}

		const folder = rootFolder || ''

		if (type === 'link' || type === 'inline') {
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

		if (type === 'external') {
			return (
				<SvgImage
					{...rest}
					folder={folder}
					loading={loading}
					alt={alt}
					svg={svg}
					svgData={svgData}
				/>
			)
		}

		if (renderers && renderers[type]) {
			const El = renderers[type] as SvgElement<T>
			return (
				<El
					{...rest}
					folder={folder}
					loading={loading}
					alt={alt}
					svg={svg}
					svgData={svgData}
				/>
			)
		}

		return null
	}
}
