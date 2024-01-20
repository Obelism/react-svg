'use client'

import setupReactSvg from '@obelism/react-svg'

const SVG_MAP = {
	vercel: { width: 283, height: 64 },
	next: { width: 394, height: 80 },
}

const { SvgProvider: Provider, Svg: SvgComponent } = setupReactSvg({
	rootFolder: '/',
	svgMap: SVG_MAP,
})

export const SvgProvider = Provider
export const Svg = SvgComponent
