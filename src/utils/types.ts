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
