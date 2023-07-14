import React, { memo, useCallback, useState } from 'react'

import { SvgListT, SvgProviderProps } from '../config/types'
import {
	SvgContext,
	SvgDispatch,
	SvgDispatchType,
	INITIAL_SVG_DATA,
} from '../config/SvgContext'

import { GetSvgId } from '../functions/getSvgIdGenerator'

export const svgProviderGenerator = <T extends SvgListT>(
	svgs: T,
	SvgGroup: ({
		svg,
		...rest
	}: {
		[x: string]: any
		svg: keyof T
	}) => JSX.Element | null,
	getSvgId: GetSvgId,
) => {
	const Provider = memo(({ children }: SvgProviderProps) => {
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
