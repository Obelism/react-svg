import { createContext, Dispatch } from 'react'

export interface IconData {
	[key: string]: boolean
}

export type IconDispatchType = string

export type IconDispatch = Dispatch<IconDispatchType>

export const INITIAL_ICON_DATA: IconData = {}

export const INITIAL_ICON_DISPATCH: IconDispatch = (_type: IconDispatchType) =>
	null

export const IconContext = createContext(INITIAL_ICON_DISPATCH)
