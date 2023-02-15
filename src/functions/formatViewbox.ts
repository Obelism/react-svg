import { SvgT } from '../config/types'

export const formatViewbox = ({ x, y, width, height }: SvgT) =>
	[x || 0, y || 0, width, height].join(' ')
