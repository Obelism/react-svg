import type React from "react"
import { createSvgConfig } from "./_shared/createSvgConfig"
import { type GetSvgUrl, resolveSvgUrl } from "./_shared/resolveSvgUrl"
import { Svg, type SvgElement } from "./components/Svg"
import { SvgProvider, type SvgProviderProps } from "./components/SvgProvider"
import type { SvgMap, SvgOptions, SvgRenderMap } from "./config/types"

/**
 * The supported surface is deliberately small. The components each render type
 * is built out of, the context behind `config`, and the id/viewbox helpers are
 * all internal: their props are resolved internals rather than a designed API,
 * and exporting them would freeze that shape. See docs/adr/0003.
 */

export { createSvgConfig } from "./_shared/createSvgConfig"
export { formatSvgPath } from "./_shared/formatSvgPath"
export { type GetSvgUrl, resolveSvgUrl } from "./_shared/resolveSvgUrl"
export {
	Svg,
	type SvgComponentProps,
	type SvgElement,
	type SvgProps,
} from "./components/Svg"
export { SvgProvider, type SvgProviderProps } from "./components/SvgProvider"
export type {
	SvgConfig,
	SvgEntry,
	SvgMap,
	SvgOptions,
	SvgRenderer,
	SvgRendererProps,
	SvgRenderMap,
} from "./config/types"

/** `<SvgProvider />` narrowed to a single svg map. */
export type SvgProviderElement<SvgMapT extends SvgMap = SvgMap> = (
	props: SvgProviderProps<SvgMapT>,
) => React.JSX.Element

/**
 * @function setupReactSvg
 * @description Narrow `Svg` and `SvgProvider` to a single svg map, so the svg
 * keys and render types autocomplete without repeating the config at every call
 * site.
 *
 * Nothing is created here. The components handed back are this package's own
 * exports — only their types are narrowed, which is what keeps them addressable
 * as client references across the RSC boundary. Pass the returned `config` to
 * `<SvgProvider />`.
 */
export const setupReactSvg = <
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
>(
	options: SvgOptions<SvgMapT, SvgRenderMapT>,
) => {
	const config = createSvgConfig(options)

	return {
		SvgProvider: SvgProvider as SvgProviderElement<SvgMapT>,
		Svg: Svg as SvgElement<SvgMapT, SvgRenderMapT>,
		getSvgUrl: ((svg) => resolveSvgUrl(config, svg)) as GetSvgUrl<SvgMapT>,
		config,
	}
}

export default setupReactSvg
