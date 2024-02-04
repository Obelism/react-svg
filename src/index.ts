import {
	SvgConfig,
	SvgMap,
	SvgRendererProps,
	SvgRenderer,
	SvgRenderMap,
	SvgElementArgs,
} from './config/types'

import { getSvgIdGenerator } from './functions/getSvgIdGenerator'

import { svgGenerator, SvgProps, SvgElement } from './generators/svgGenerator'
import {
	svgProviderGenerator,
	SvgProviderProps,
} from './generators/svgProviderGenerator'
import { svgImageGenerator } from './generators/svgImageGenerator'
import {
	svgGroupGenerator,
	SvgGroupProps,
	SvgGroup,
} from './generators/svgGroupGenerator'

type SetupReactSvgArgs<
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
> = {
	svgMap: SvgMapT
	rootFolder?: string
	idPrefix?: string
	svgRenderers?: SvgRenderMapT
}

/**
 * @function setupReactSvg
 * @description Create the SvgProvider and Svg component based on the given arguments
 */
const setupReactSvg = <
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
>({
	svgMap,
	rootFolder,
	idPrefix,
	svgRenderers,
}: SetupReactSvgArgs<SvgMapT, SvgRenderMapT>) => {
	const getSvgId = getSvgIdGenerator(idPrefix)
	const SvgGroup = svgGroupGenerator<SvgMapT>(svgMap, rootFolder)
	const SvgImage = svgImageGenerator<SvgMapT>()

	return {
		SvgProvider: svgProviderGenerator<SvgMapT>(svgMap, SvgGroup, getSvgId),
		Svg: svgGenerator<SvgMapT, SvgRenderMapT>(
			svgMap,
			SvgGroup,
			getSvgId,
			SvgImage,
			rootFolder,
			svgRenderers,
		),
	}
}

export type {
	SvgConfig,
	SvgMap,
	SvgRendererProps,
	SvgRenderer,
	SvgRenderMap,
	SvgElementArgs,
	SetupReactSvgArgs,
	SvgProps,
	SvgElement,
	SvgProviderProps,
	SvgGroupProps,
	SvgGroup,
}

export default setupReactSvg
