import React, { FC, memo, ReactNode, useCallback, useState } from 'react'

import {
	SvgContext,
	SvgDispatch,
	SvgDispatchType,
	INITIAL_SVG_DATA,
} from '../utils/SvgContext'
import { SvgsObj } from '../utils/types'
import { GetSvgId } from '../utils/getSvgIdGenerator'

import { SvgGroupInterface } from './SvgGroup'

interface SvgProviderProps {
	children: ReactNode
}

export type SvgProvider = FC<SvgProviderProps>

export const svgProviderGenerator = (
	svgs: SvgsObj,
	SvgGroup: SvgGroupInterface,
	getSvgId: GetSvgId,
): SvgProvider => {
	const Provider: SvgProvider = memo(({ children }) => {
		const [svgsData, setSvgsData] = useState(INITIAL_SVG_DATA)
		const referencedKeys = Object.keys(svgsData)

		const loadSvgData: SvgDispatch = useCallback((svg: SvgDispatchType) => {
			if (!svgs[svg]) return

			setSvgsData((state) => ({
				...state,
				[svg]: true,
			}))
		}, [])

		return (
			<>
				{referencedKeys.length > 0 && (
					<svg style={{ display: 'none' }}>
						<defs>
							{referencedKeys.map((svg) => (
								<SvgGroup key={svg} id={getSvgId(svg)} svg={svg} />
							))}
						</defs>
					</svg>
				)}

				<SvgContext.Provider value={loadSvgData}>
					{children}
				</SvgContext.Provider>
			</>
		)
	})

	Provider.displayName = 'SvgProvider'

	return Provider
}
