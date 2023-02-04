import { createContext, Dispatch } from 'react'

export interface SvgData {
	[key: string]: boolean
}

export type SvgDispatchType = string

export type SvgDispatch = Dispatch<SvgDispatchType>

export const INITIAL_SVG_DATA: SvgData = {}

export const INITIAL_SVG_DISPATCH: SvgDispatch = (_type: SvgDispatchType) =>
	null

export const SvgContext = createContext(INITIAL_SVG_DISPATCH)
