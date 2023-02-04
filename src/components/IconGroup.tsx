import React, { FC } from 'react'
import useSWR from 'swr'

import { IconDispatchType } from '../utils/IconContext'
import { IconsObj } from '../utils/types'

interface IconGroupProps {
	icon: IconDispatchType
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

export type IconGroupInterface = FC<IconGroupProps>

export const iconGroupGenerator =
	(icons: IconsObj): IconGroupInterface =>
	({ icon, ...rest }) => {
		const { data, error } = useSWR(icons[icon].path, fetcher, SWRConfig)

		if (!data || error) return null

		return <g {...rest} dangerouslySetInnerHTML={{ __html: data }} />
	}
