import { SvgConfig } from '../config/types'

export const formatSvgViewBox = ({ x, y, width, height }: SvgConfig) =>
	[x || 0, y || 0, width, height].join(' ')
