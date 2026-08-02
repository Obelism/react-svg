import type { SvgConfig, SvgMap } from "../config/types"
import { formatSvgPath } from "./formatSvgPath"

export type GetSvgUrl<SvgMapT extends SvgMap> = (svg: keyof SvgMapT) => string

/**
 * @function resolveSvgUrl
 * @description The url this library fetches for a given svg key: the entry's
 * `path` when set, the `rootFolder` plus the generated filename otherwise.
 */
export const resolveSvgUrl = <SvgMapT extends SvgMap>(
	{ svgMap, rootFolder }: SvgConfig<SvgMapT>,
	svg: keyof SvgMapT,
): string => {
	const entry = svgMap[svg]

	if (!entry) {
		throw new Error(
			`setupReactSvg - Unknown svg provided; "${String(svg)}", check your setupReactSvg(...)`,
		)
	}

	return entry.path || formatSvgPath<SvgMapT>(svg, rootFolder)
}
