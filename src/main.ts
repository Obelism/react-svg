import { SvgListT } from './utils/types'
import { getSvgIdGenerator } from './utils/getSvgIdGenerator'

import { Svg, svgGenerator } from './components/svgGenerator'
import { svgGroupGenerator } from './components/svgGroupGenerator'
import { svgImageGenerator } from './components/svgImageGenerator'
import { SvgProvider, svgProviderGenerator } from './components/SvgProvider'

interface setupReactSvgArgs {
	svgs: SvgListT
	rootFolder?: string
	idPrefix?: string
}

interface setupReactSvgReturn {
	Svg: Svg
	SvgProvider: SvgProvider
}

const setupReactSvg = ({
	svgs,
	rootFolder,
	idPrefix,
}: setupReactSvgArgs): setupReactSvgReturn => {
	const getSvgId = getSvgIdGenerator(idPrefix)

	const SvgGroup = svgGroupGenerator(svgs, rootFolder)
	const SvgImage = svgImageGenerator(rootFolder)

	return {
		SvgProvider: svgProviderGenerator(svgs, SvgGroup, getSvgId),
		Svg: svgGenerator(svgs, SvgGroup, SvgImage, getSvgId),
	}
}

export default setupReactSvg
