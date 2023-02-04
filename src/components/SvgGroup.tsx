import React, { FC } from 'react'
import useSWR from 'swr'

import { SvgDispatchType } from '../utils/SvgContext'
import { SvgsObj } from '../utils/types'

interface SvgGroupProps {
	svg: SvgDispatchType
	[x: string]: any
}

const SWRConfig = Object.freeze({
	revalidateIfStale: false,
	revalidateOnFocus: false,
	realidateOnReconnect: false,
})

const fetcher = async (path: string) => {
	const res = await fetch(path)
	return await res.text()
}

export type SvgGroupInterface = FC<SvgGroupProps>

export const svgGroupGenerator =
	(svgs: SvgsObj): SvgGroupInterface =>
	({ svg, ...rest }) => {
		const { data, error } = useSWR(svgs[svg].path, fetcher, SWRConfig)

		if (!data || error) return null

		return <g {...rest} dangerouslySetInnerHTML={{ __html: data }} />
	}
