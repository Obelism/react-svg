'use client'

import setupReactSvg from '@obelism/react-svg'

const SVG_MAP = {
	vercel: { width: 283, height: 64 },
	next: { width: 394, height: 80 },
}

const { SvgProvider: Provider, Svg: SvgComponent } = setupReactSvg({
	rootFolder: '/',
	svgMap: SVG_MAP,
	svgRenderers: {
		externalLink: ({ svg, folder, svgData, ...rest }) => (
			<svg {...rest} viewBox={`0 0 ${svgData.width} ${svgData.height}`}>
				<use x="0" y="0" href={`${folder}${svg}.svg#svg`} />
			</svg>
		),
	},
})

export const SvgProvider = Provider
export const Svg = SvgComponent
