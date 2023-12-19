export type SvgT = {
	path?: string
	width: number
	height: number
	x?: number
	y?: number
	alt?: string
}

export type SvgListT = {
	[key: string]: SvgT
}

export type SvgElementArgs<T extends SvgListT> = {
	folder: string
	svg: keyof T
	svgData: SvgT
	alt: string
	loading?: 'lazy' | 'eager'
	[key: string]: any
}

export type SvgElement<T extends SvgListT> = (
	args: SvgElementArgs<T>,
) => JSX.Element | null

export type ElementMap<T extends SvgListT> = Record<string, SvgElement<T>>
