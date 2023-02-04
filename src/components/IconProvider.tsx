import React, { FC, ReactNode, useCallback, useState } from 'react'

import {
	IconContext,
	IconDispatch,
	IconDispatchType,
	INITIAL_ICON_DATA,
} from '../utils/IconContext'
import { IconsObj } from '../utils/types'
import { GetSvgId } from '../utils/getSvgIdGenerator'

import { IconGroupInterface } from '../components/IconGroup'

interface IconProviderProps {
	children: ReactNode
}

export type IconProvider = FC<IconProviderProps>

export const iconProviderGenerator =
	(
		icons: IconsObj,
		IconGroup: IconGroupInterface,
		getSvgId: GetSvgId,
	): IconProvider =>
	({ children }) => {
		const [iconsData, setIconsData] = useState(INITIAL_ICON_DATA)

		const loadIconData: IconDispatch = useCallback((icon: IconDispatchType) => {
			if (!icons[icon]) return

			setIconsData((state) => ({
				...state,
				[icon]: true,
			}))
		}, [])

		return (
			<>
				<svg style={{ display: 'none' }}>
					<defs>
						{Object.keys(iconsData).map((icon) => (
							<IconGroup key={icon} id={getSvgId(icon)} icon={icon} />
						))}
					</defs>
				</svg>

				<IconContext.Provider value={loadIconData}>
					{children}
				</IconContext.Provider>
			</>
		)
	}
