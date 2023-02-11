import React, { FC, useContext, useEffect } from 'react'

import { SvgContext } from '../utils/SvgContext'
import { CompleteSvgObj, CompleteSvgsObj } from '../utils/types'
import { GetSvgId } from '../utils/getSvgIdGenerator'

import { SvgGroupInterface } from '../components/SvgGroup'
import { SvgImage } from './SvgImage'

interface SvgProps {
	type: 'external' | 'link' | 'inline'
	svg: string
	[x: string]: any
}

export type Svg = FC<SvgProps>

const formatViewbox = ({ x, y, width, height }: CompleteSvgObj) =>
	[x || 0, y || 0, width, height].join(' ')

export const svgGenerator = (
	svgs: CompleteSvgsObj,
	SvgGroup: SvgGroupInterface,
	getSvgId: GetSvgId,
): Svg => {
	const useSvgLink = (svg: string) => {
		const linkSvg = useContext(SvgContext)

		useEffect(() => {
			if (svg === '' || !svgs[svg]) return
			linkSvg(svg)
		}, [linkSvg, svg])
	}

	return ({ type = 'link', svg, alt, ...rest }) => {
		useSvgLink(type === 'link' ? svg : '')

		const svgData = svgs[svg]

		if (!svgData) return null

		if (type === 'external')
			return <SvgImage {...rest} alt={alt} svgData={svgData} />

		return (
			<svg {...rest} viewBox={formatViewbox(svgData)} xmlSpace="preserve">
				{(alt || svgData.alt) && <title>{alt || svgData.alt}</title>}

				{type === 'inline' ? (
					<SvgGroup svg={svg} />
				) : (
					<use x="0" y="0" xlinkHref={`#${getSvgId(svg)}`} />
				)}
			</svg>
		)
	}
}
