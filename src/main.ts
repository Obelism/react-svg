import { Svg, svgGenerator } from './components/Svg'
import { svgGroupGenerator } from './components/SvgGroup'
import { SvgProvider, svgProviderGenerator } from './components/SvgProvider'
import { SvgsObj } from './utils/types'
import { getSvgIdGenerator } from './utils/getSvgIdGenerator'

interface setupReactSvgArgs {
	svgs: SvgsObj
	idPrefix?: string
}

interface setupReactSvgReturn {
	Svg: Svg
	SvgProvider: SvgProvider
}

const setupReactSvg = ({
	svgs,
	idPrefix,
}: setupReactSvgArgs): setupReactSvgReturn => {
	const getSvgId = getSvgIdGenerator(idPrefix)
	const SvgGroup = svgGroupGenerator(svgs)

	return {
		SvgProvider: svgProviderGenerator(svgs, SvgGroup, getSvgId),
		Svg: svgGenerator(svgs, SvgGroup, getSvgId),
	}
}

export default setupReactSvg
