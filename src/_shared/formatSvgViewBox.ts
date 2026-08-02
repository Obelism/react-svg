import type { SvgEntry } from "../config/types"

export const formatSvgViewBox = ({ x, y, width, height }: SvgEntry) =>
	[x || 0, y || 0, width, height].join(" ")
