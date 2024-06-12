import React, { memo } from 'react'

import { SvgMap } from '../config/types'
import { GetSvgId } from '../functions/getSvgIdGenerator'
import { SvgGroup } from './svgGroupGenerator'
import { useLinkedSvgList } from '../functions/useSvgLoaded'

export type SvgProviderProps = {
	children?:
		| React.ReactNode
		| React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

export const svgProviderGenerator = <SvgMapT extends SvgMap>(
	SvgGroup: SvgGroup<SvgMapT>,
	getSvgId: GetSvgId,
) => {
	const Provider = memo(({ children }: SvgProviderProps) => {
		const [linkedSvgList] = useLinkedSvgList()
		const referencedKeys = linkedSvgList ? Object.keys(linkedSvgList) : []

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

				{children}
			</>
		)
	})

	Provider.displayName = 'SvgProvider'

	return Provider
}
