import React, { memo, useContext, useEffect } from 'react'

import { SvgMap, SvgRenderMap } from '../config/types'
import { SvgContext } from '../config/SvgContext'

import { GetSvgId } from '../functions/getSvgIdGenerator'
import { SvgGroup } from './svgGroupGenerator'
import { SvgImage } from './svgImageGenerator'
import { formatViewBox } from '../functions/formatViewBox'

export type SvgProps<
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
> = {
	type: 'link' | 'inline' | 'external' | keyof SvgRenderMapT
	svg: keyof SvgMapT
	loading?: 'lazy' | 'eager'
	className?: string
	[x: string]: any
}

export type SvgElement<
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
> = ({
	type,
	svg,
	alt,
	loading,
	...rest
}: SvgProps<SvgMapT, SvgRenderMapT>) => React.JSX.Element | null

/**
 * Generator
 */
export const svgGenerator = <
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
>(
	svgMap: SvgMapT,
	SvgGroup: SvgGroup<SvgMapT>,
	getSvgId: GetSvgId,
	SvgImage: SvgImage<SvgMapT>,
	rootFolder?: string,
	svgRendererMap?: SvgRenderMapT,
): React.MemoExoticComponent<SvgElement<SvgMapT, SvgRenderMapT>> => {
	const Svg = memo(
		({
			type = 'link',
			svg,
			alt,
			loading,
			...rest
		}: SvgProps<SvgMapT, SvgRenderMapT>) => {
			const linkSvg = useContext(SvgContext)

			useEffect(() => {
				if (type !== 'link') return
				linkSvg(String(svg))
			}, [linkSvg, svg])

			const svgData = svgMap[svg]

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
					<svg {...rest} viewBox={formatViewBox(svgData)} xmlSpace="preserve">
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

			if (svgRendererMap && svgRendererMap[type as string]) {
				const El = svgRendererMap[type as string] as any
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
		},
	)

	Svg.displayName = 'Svg'

	return Svg
}
