import React from 'react'
import useSWR from 'swr'

import { SvgListT } from '../config/types'
import { SWRConfig } from '../config/SWRConfig'

import { formatSvgPath } from '../functions/formatSvgPath'
import { svgFetcher } from '../functions/svgFetcher'

export const svgGroupGenerator = <T extends SvgListT>(
	svgs: T,
	rootFolder?: string,
) => {
	return ({ svg, ...rest }: { svg: keyof T; [x: string]: any }) => {
		const { data, error } = useSWR(
			svgs[svg].path || formatSvgPath<T>(svg, rootFolder),
			svgFetcher,
			SWRConfig,
		)

		if (!data || error) return null

		return <g {...rest} dangerouslySetInnerHTML={{ __html: data }} />
	}
}
