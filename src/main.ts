import { SvgListT } from './config/types'

import { getSvgIdGenerator } from './functions/getSvgIdGenerator'

import { svgGenerator } from './generators/svgGenerator'
import { svgProviderGenerator } from './generators/svgProviderGenerator'
import { svgImageGenerator } from './generators/svgImageGenerator'
import { svgGroupGenerator } from './generators/svgGroupGenerator'

/**
 * Create the SvgProvider and Svg component based on the given arguments
 */
const setupReactSvg = <T extends SvgListT>({
	svgs,
	rootFolder,
	idPrefix,
}: {
	svgs: T
	rootFolder?: string
	idPrefix?: string
}) => {
	const getSvgId = getSvgIdGenerator(idPrefix)
	const SvgGroup = svgGroupGenerator<T>(svgs, rootFolder)
	const SvgImage = svgImageGenerator(rootFolder)

	return {
		SvgProvider: svgProviderGenerator<T>(svgs, SvgGroup, getSvgId),
		Svg: svgGenerator<T>(svgs, SvgImage, SvgGroup, getSvgId),
	}
}

export default setupReactSvg
