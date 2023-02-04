export interface IconObj {
	path: string
	x: number
	y: number
	width: number
	height: number
	alt?: string
}

export interface IconsObj {
	[key: string]: IconObj
}
