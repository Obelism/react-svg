import { Icon, iconGenerator } from './components/Icon'
import { iconGroupGenerator } from './components/IconGroup'
import { IconProvider, iconProviderGenerator } from './components/IconProvider'
import { IconsObj } from './utils/types'
import { getSvgIdGenerator } from './utils/getSvgIdGenerator'

interface SetupReactIconArgs {
	icons: IconsObj
	idPrefix?: string
}

interface SetupReactIconReturn {
	Icon: Icon
	IconProvider: IconProvider
}

const setupReactIcon = ({
	icons,
	idPrefix,
}: SetupReactIconArgs): SetupReactIconReturn => {
	const getSvgId = getSvgIdGenerator(idPrefix)
	const IconGroup = iconGroupGenerator(icons)

	return {
		IconProvider: iconProviderGenerator(icons, IconGroup, getSvgId),
		Icon: iconGenerator(icons, IconGroup, getSvgId),
	}
}

export default setupReactIcon
