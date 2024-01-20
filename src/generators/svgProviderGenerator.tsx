import React, { memo, useCallback, useState } from 'react'

import { SvgMap } from '../config/types'
import {
	SvgContext,
	SvgDispatch,
	SvgDispatchType,
	INITIAL_SVG_DATA,
} from '../config/SvgContext'

import { GetSvgId } from '../functions/getSvgIdGenerator'
import { SvgGroup } from './svgGroupGenerator'

export type SvgProviderProps = {
	children:
		| React.ReactNode
		| React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

export const svgProviderGenerator = <SvgMapT extends SvgMap>(
	svgMap: SvgMapT,
	SvgGroup: SvgGroup<SvgMapT>,
	getSvgId: GetSvgId,
) => {
	const Provider = memo(({ children }: SvgProviderProps) => {
		const [svgMapToLoad, setSvgMapToLoad] = useState(INITIAL_SVG_DATA)
		const referencedKeys = Object.keys(svgMapToLoad)

		const loadSvgData: SvgDispatch = useCallback((svg: SvgDispatchType) => {
			if (!svgMap[svg]) return

			setSvgMapToLoad((state) => ({
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
