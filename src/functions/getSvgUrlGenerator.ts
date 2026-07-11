import type { SvgMap } from "../config/types"
import { formatSvgPath } from "./formatSvgPath"

export type GetSvgUrl<SvgMapT extends SvgMap> = (svg: keyof SvgMapT) => string

export const getSvgUrlGenerator =
	<SvgMapT extends SvgMap>(
		svgMap: SvgMapT,
		rootFolder?: string,
	): GetSvgUrl<SvgMapT> =>
	(svg) => {
		const svgData = svgMap[svg]

		if (!svgData) {
			throw new Error(
				`setupReactSvg - Unknown svg provided; "${String(svg)}", check your setupReactSvg(...)`,
			)
		}

		return svgData.path || formatSvgPath<SvgMapT>(svg, rootFolder)
	}
