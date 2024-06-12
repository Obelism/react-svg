import React, { memo, useEffect, useRef } from 'react'

import { SvgMap, SvgRenderMap } from '../config/types'

import { GetSvgId } from '../functions/getSvgIdGenerator'
import { SvgGroup } from './svgGroupGenerator'
import { SvgImage } from './svgImageGenerator'
import { formatSvgViewBox } from '../functions/formatSvgViewBox'
import { useLinkSvg, useLinkedSvgLoaded } from '../functions/useSvgLoaded'

export type SvgProps<
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
> = {
	type: 'link' | 'inline' | 'external' | keyof SvgRenderMapT
	svg: keyof SvgMapT
	loading?: 'lazy' | 'eager'
	className?: string
	onLoad?: () => void
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

const BaseSvg = ({ svgData, alt, children, ...rest }: any) => {
	return (
		<svg {...rest} viewBox={formatSvgViewBox(svgData)} xmlSpace="preserve">
			{(alt || svgData.alt) && <title>{alt || svgData.alt}</title>}
			{children}
		</svg>
	)
}

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
	const InlineSvg = ({
		svgData,
		alt,
		getSvgId,
		svg,
		onLoad,
		...rest
	}: Omit<SvgProps<SvgMapT, SvgRenderMapT>, 'type'>) => {
		const loaded = useRef<boolean>(false)

		useEffect(() => {
			if (!onLoad || loaded.current) return
			loaded.current = true
			onLoad()
		}, [])

		return (
			<BaseSvg {...rest} svgData={svgData} alt={alt} onLoad={onLoad}>
				<SvgGroup svg={svg} />
			</BaseSvg>
		)
	}

	const LinkedSvg = ({
		svgData,
		alt,
		getSvgId,
		svg,
		onLoad,
		...rest
	}: Omit<SvgProps<SvgMapT, SvgRenderMapT>, 'type'>) => {
		const loaded = useLinkedSvgLoaded(String(svg))

		useEffect(() => {
			if (!onLoad || !loaded) return
			onLoad()
		}, [onLoad, loaded])

		return (
			<BaseSvg {...rest} svgData={svgData} alt={alt}>
				<use x="0" y="0" href={`#${getSvgId(String(svg))}`} />
			</BaseSvg>
		)
	}

	const Svg = memo(
		({
			type = 'link',
			svg,
			alt,
			loading,
			onLoad,
			...rest
		}: SvgProps<SvgMapT, SvgRenderMapT>) => {
			const linkSvg = useLinkSvg()

			useEffect(() => {
				if (type !== 'link') return
				linkSvg(String(svg))
			}, [linkSvg, svg])

			const svgData = svgMap[svg]

			if (!svgData) {
				if (process.env.NODE_ENV !== 'production') {
					console.error(
						`SvgProvider - Unknown svg provided; "${String(
							svg,
						)}", check your setupReactSvg(...)`,
					)
				}
				return null
			}

			const folder = rootFolder || ''

			if (type === 'inline') {
				return (
					<InlineSvg
						{...rest}
						onLoad={onLoad}
						getSvgId={getSvgId}
						svgData={svgData}
						alt={alt}
						svg={svg}
					/>
				)
			}

			if (type === 'link') {
				return (
					<LinkedSvg
						{...rest}
						onLoad={onLoad}
						getSvgId={getSvgId}
						svgData={svgData}
						alt={alt}
						svg={svg}
					/>
				)
			}

			if (type === 'external') {
				return (
					<SvgImage
						{...rest}
						onLoad={onLoad}
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
						onLoad={onLoad}
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
