export interface SvgObj {
	path: string
	width: number
	height: number
	x?: number
	y?: number
	alt?: string
}

export interface SvgsObj {
	[key: string]: SvgObj
}
