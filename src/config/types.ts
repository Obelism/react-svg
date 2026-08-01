/**
 * What a single key in the svg map maps to: the intrinsic dimensions of one
 * svg, plus optionally where to find it and what it depicts.
 *
 * Not to be confused with {@link SvgConfig}, which is the whole resolved
 * configuration rather than one entry in it.
 */
export type SvgEntry = {
	path?: string
	width: number
	height: number
	x?: number
	y?: number
	alt?: string
}

/** The declared set of svgs an application can render, keyed by name. */
export type SvgMap = Record<string, SvgEntry>

export type SvgRendererProps<SvgMapT extends SvgMap> = {
	/**
	 * The url this svg is served from, already resolved: the entry's `path` when
	 * set, the `rootFolder` plus the generated filename otherwise. Renderers get
	 * the finished url rather than the folder, so the join rule stays inside the
	 * library. See docs/adr/0004.
	 */
	url: string
	loading?: "lazy" | "eager"
	alt?: string
	svg: keyof SvgMapT
	entry: SvgMapT[keyof SvgMapT]
	onLoad?: () => void
	// biome-ignore lint/suspicious/noExplicitAny: pass-through bag spread onto arbitrary host/custom elements; unknown breaks JSX spreading (verified via tsc)
	[key: string]: any
}

export type SvgRenderer<SvgMapT extends SvgMap> = (
	props: SvgRendererProps<SvgMapT>,
) => React.JSX.Element | null

export type SvgRenderMap<SvgMapT extends SvgMap> =
	| undefined
	| Record<string, SvgRenderer<SvgMapT>>

export type SvgElementArgs<SvgMapT extends SvgMap> = {
	url: string
	svg: keyof SvgMapT
	entry: SvgEntry
	alt?: string
	loading?: "lazy" | "eager"
	onLoad?: () => void
	// biome-ignore lint/suspicious/noExplicitAny: pass-through bag spread onto arbitrary host/custom elements; unknown breaks JSX spreading (verified via tsc)
	[key: string]: any
}

/**
 * The options accepted by `setupReactSvg()`, and by `<SvgProvider />` when it is
 * configured through props instead of through a pre-built config.
 */
export type SvgOptions<
	SvgMapT extends SvgMap = SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT> = SvgRenderMap<SvgMapT>,
> = {
	svgMap: SvgMapT
	rootFolder?: string
	namespace?: string
	svgRenderers?: SvgRenderMapT
}

/**
 * The resolved settings a set of components renders against: an svg map
 * together with how to locate and namespace it. Created once by
 * `createSvgConfig()` and then handed to the components, either through the
 * `config` prop or through `<SvgProvider />`.
 *
 * "Config" always means this whole object. A single entry within the svg map
 * is an {@link SvgEntry}.
 */
export type SvgConfig<SvgMapT extends SvgMap = SvgMap> = {
	svgMap: SvgMapT
	rootFolder?: string
	namespace: string
	svgRenderers?: Record<string, SvgRenderer<SvgMapT>>
}
