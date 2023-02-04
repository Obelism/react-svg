export interface SvgObj {
	path: string
	x: number
	y: number
	width: number
	height: number
	alt?: string
}

export interface SvgsObj {
	[key: string]: SvgObj
}
