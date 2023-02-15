import React, { FC } from 'react'
import useSWR from 'swr'

import { SvgDispatchType } from '../utils/SvgContext'
import { CompleteSvgsObj } from '../utils/types'

interface SvgGroupProps {
	svg: SvgDispatchType
	[x: string]: any
}

const SWRConfig = Object.freeze({
	revalidateIfStale: false,
	revalidateOnFocus: false,
	realidateOnReconnect: false,
})

const ATTRIUBTES_TO_STRIP = ['xmlns', 'viewBox', 'xml:space']

const removeSvgTag = (str: string): string => {
	const parser = new DOMParser()
	const svg = parser.parseFromString(str, 'image/svg+xml').querySelector('svg')
	const innerContent = svg?.innerHTML

	if (!innerContent) return ''

	const attributes = Array.from(svg.attributes)
		.filter((attr) => !ATTRIUBTES_TO_STRIP.includes(attr.name))
		.map((attr) => `${attr.name}="${attr.value}"`)
		.join(' ')

	return `<g ${attributes}>${innerContent}</g>`
}

const fetcher = async (path: string) => {
	const res = await fetch(path)
	const svgText = await res.text()
	return removeSvgTag(svgText)
}

export type SvgGroupInterface = FC<SvgGroupProps>

export const svgGroupGenerator = (svgs: CompleteSvgsObj): SvgGroupInterface => {
	return ({ svg, ...rest }) => {
		const { data, error } = useSWR(svgs[svg].path, fetcher, SWRConfig)

		if (!data || error) return null

		return <g {...rest} dangerouslySetInnerHTML={{ __html: data }} />
	}
}
