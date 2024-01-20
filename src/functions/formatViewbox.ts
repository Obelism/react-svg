import { SvgConfig } from '../config/types'

export const formatViewBox = ({ x, y, width, height }: SvgConfig) =>
	[x || 0, y || 0, width, height].join(' ')
