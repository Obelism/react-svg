import { Svg, svgGenerator } from './components/Svg'
import { svgGroupGenerator } from './components/SvgGroup'
import { SvgProvider, svgProviderGenerator } from './components/SvgProvider'
import { InputSvgsObj } from './utils/types'
import { getSvgIdGenerator } from './utils/getSvgIdGenerator'
import { formatSvgsObject } from './utils/formatSvgsObject'

interface setupReactSvgArgs {
	svgs: InputSvgsObj
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
	const formattedSvgsObject = formatSvgsObject(svgs, rootFolder)
	const getSvgId = getSvgIdGenerator(idPrefix)
	const SvgGroup = svgGroupGenerator(formattedSvgsObject)

	return {
		SvgProvider: svgProviderGenerator(formattedSvgsObject, SvgGroup, getSvgId),
		Svg: svgGenerator(formattedSvgsObject, SvgGroup, getSvgId),
	}
}

export default setupReactSvg
