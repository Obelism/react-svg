import React, { FC, ReactNode, useCallback, useState } from 'react'

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

export const svgProviderGenerator =
	(
		svgs: SvgsObj,
		SvgGroup: SvgGroupInterface,
		getSvgId: GetSvgId,
	): SvgProvider =>
	({ children }) => {
		const [svgsData, setSvgsData] = useState(INITIAL_SVG_DATA)

		const loadSvgData: SvgDispatch = useCallback((svg: SvgDispatchType) => {
			if (!svgs[svg]) return

			setSvgsData((state) => ({
				...state,
				[svg]: true,
			}))
		}, [])

		return (
			<>
				<svg style={{ display: 'none' }}>
					<defs>
						{Object.keys(svgsData).map((svg) => (
							<SvgGroup key={svg} id={getSvgId(svg)} svg={svg} />
						))}
					</defs>
				</svg>

				<SvgContext.Provider value={loadSvgData}>
					{children}
				</SvgContext.Provider>
			</>
		)
	}
