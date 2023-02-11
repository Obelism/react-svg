export interface InputSvgObj {
	path?: string
	width: number
	height: number
	x?: number
	y?: number
	alt?: string
}

export interface InputSvgsObj {
	[key: string]: InputSvgObj
}

export interface CompleteSvgObj {
	path: string
	width: number
	height: number
	x: number
	y: number
	alt: string
}

export interface CompleteSvgsObj {
	[key: string]: CompleteSvgObj
}
