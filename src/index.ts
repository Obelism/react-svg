import type {
	SvgConfig,
	SvgElementArgs,
	SvgMap,
	SvgRenderer,
	SvgRendererProps,
	SvgRenderMap,
} from "./config/types"

import { getSvgIdGenerator } from "./functions/getSvgIdGenerator"

import {
	type SvgElement,
	type SvgProps,
	svgGenerator,
} from "./generators/svgGenerator"
import {
	type SvgGroup,
	type SvgGroupProps,
	svgGroupGenerator,
} from "./generators/svgGroupGenerator"
import { svgImageGenerator } from "./generators/svgImageGenerator"
import {
	type SvgProviderProps,
	svgProviderGenerator,
} from "./generators/svgProviderGenerator"

export { formatSvgPath } from "./functions/formatSvgPath"

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
export const setupReactSvg = <
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
		SvgProvider: svgProviderGenerator<SvgMapT>(SvgGroup, getSvgId),
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
