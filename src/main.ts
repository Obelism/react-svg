import { SvgListT, ElementMap } from './config/types'

import { getSvgIdGenerator } from './functions/getSvgIdGenerator'

import { svgGenerator } from './generators/svgGenerator'
import { svgProviderGenerator } from './generators/svgProviderGenerator'
import { svgImageGenerator } from './generators/svgImageGenerator'
import { svgGroupGenerator } from './generators/svgGroupGenerator'

export { formatSvgPath } from './functions/formatSvgPath'

/**
 * @function setupReactSvg
 * @description Create the SvgProvider and Svg component based on the given arguments
 */
const setupReactSvg = <T extends SvgListT, E extends ElementMap<T>>({
	svgs,
	rootFolder,
	idPrefix,
	renderers,
}: {
	svgs: T
	rootFolder?: string
	idPrefix?: string
	renderers?: E
}) => {
	const getSvgId = getSvgIdGenerator(idPrefix)
	const SvgGroup = svgGroupGenerator<T>(svgs, rootFolder)
	const SvgImage = svgImageGenerator<T>()

	return {
		SvgProvider: svgProviderGenerator<T>(svgs, SvgGroup, getSvgId),
		Svg: svgGenerator<T, E>(
			svgs,
			SvgGroup,
			getSvgId,
			SvgImage,
			renderers,
			rootFolder,
		),
	}
}

export default setupReactSvg
