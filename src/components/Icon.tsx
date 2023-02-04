import React, { FC, useContext, useEffect } from 'react'

import { IconContext } from '../utils/IconContext'
import { IconObj, IconsObj } from '../utils/types'
import { GetSvgId } from '../utils/getSvgIdGenerator'

import { IconGroupInterface } from '../components/IconGroup'
import { IconImage } from './IconImage'

interface IconProps {
	type: 'external' | 'link' | 'inline'
	icon: string
	[x: string]: any
}

export type Icon = FC<IconProps>

const formatViewbox = ({ x, y, width, height }: IconObj) =>
	[x, y, width, height].join(' ')

export const iconGenerator = (
	icons: IconsObj,
	IconGroup: IconGroupInterface,
	getSvgId: GetSvgId,
): Icon => {
	const useSvgLink = (icon: string) => {
		const linkSvg = useContext(IconContext)

		useEffect(() => {
			if (icon === '' || !icons[icon]) return
			linkSvg(icon)
		}, [linkSvg, icon])
	}

	return ({ type = 'link', icon, ...rest }) => {
		useSvgLink(type === 'link' ? icon : '')

		const iconData = icons[icon]

		if (!iconData) return null

		if (type === 'external') return <IconImage {...rest} iconData={iconData} />

		return (
			<svg {...rest} viewBox={formatViewbox(iconData)} xmlSpace="preserve">
				{iconData.alt && <title>{iconData.alt}</title>}

				{type === 'inline' ? (
					<IconGroup icon={icon} />
				) : (
					<use x="0" y="0" xlinkHref={`#${getSvgId(icon)}`} />
				)}
			</svg>
		)
	}
}
