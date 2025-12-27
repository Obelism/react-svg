export type SvgConfig = {
	path?: string
	width: number
	height: number
	x?: number
	y?: number
	alt?: string
}

export type SvgMap = Record<string, SvgConfig>

export type SvgRendererProps<SvgMapT extends SvgMap> = {
	folder?: string
	loading: boolean
	alt?: string
	svg: keyof SvgMapT
	svgData: SvgMapT[keyof SvgMapT]
}

export type SvgRenderer<SvgMapT extends SvgMap> = (
	props: SvgRendererProps<SvgMapT>,
) => React.JSX.Element | null

export type SvgRenderMap<SvgMapT extends SvgMap> =
	| undefined
	| Record<string, SvgRenderer<SvgMapT>>

export type SvgElementArgs<SvgMapT extends SvgMap> = {
	folder: string
	svg: keyof SvgMapT
	svgData: SvgConfig
	alt: string
	loading?: "lazy" | "eager"
	onLoad?: () => void
	[key: string]: any
}
