import type {
	SvgConfig,
	SvgElementArgs,
	SvgMap,
	SvgRenderer,
	SvgRendererProps,
	SvgRenderMap,
} from "./config/types"

import {
	getSvgIdGenerator,
	resolveIdPrefix,
} from "./functions/getSvgIdGenerator"
import {
	type GetSvgUrl,
	getSvgUrlGenerator,
} from "./functions/getSvgUrlGenerator"

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
	const namespace = resolveIdPrefix(idPrefix)
	const getSvgId = getSvgIdGenerator(idPrefix)
	const SvgGroup = svgGroupGenerator<SvgMapT>(svgMap, namespace, rootFolder)
	const SvgImage = svgImageGenerator<SvgMapT>()

	return {
		SvgProvider: svgProviderGenerator<SvgMapT>(SvgGroup, getSvgId, namespace),
		Svg: svgGenerator<SvgMapT, SvgRenderMapT>(
			svgMap,
			SvgGroup,
			getSvgId,
			SvgImage,
			namespace,
			rootFolder,
			svgRenderers,
		),
		getSvgUrl: getSvgUrlGenerator<SvgMapT>(svgMap, rootFolder),
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
	GetSvgUrl,
}

export default setupReactSvg
