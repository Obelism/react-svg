import { FC, ReactNode } from 'react'

export interface SvgT {
	path?: string
	width: number
	height: number
	x?: number
	y?: number
	alt?: string
}

export interface SvgListT {
	[key: string]: SvgT
}

export interface SvgImage {
	svgData: SvgT
	loading?: 'lazy' | 'eager'
	[key: string]: any
}

interface SvgProviderProps {
	children: ReactNode
}

export type SvgProvider = FC<SvgProviderProps>
