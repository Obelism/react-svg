import { SvgMap, SvgRenderMap } from './config/types'

import { getSvgIdGenerator } from './functions/getSvgIdGenerator'

import { svgGenerator } from './generators/svgGenerator'
import { svgProviderGenerator } from './generators/svgProviderGenerator'
import { svgImageGenerator } from './generators/svgImageGenerator'
import { svgGroupGenerator } from './generators/svgGroupGenerator'

export { formatSvgPath } from './functions/formatSvgPath'

export type SetupReactSvgArgs<
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
	svgMap: svgMap,
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

export default setupReactSvg
