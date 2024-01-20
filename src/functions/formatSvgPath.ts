import { SvgMap } from 'config/types'

export const formatSvgPath = <SvgMapT extends SvgMap>(
	file: keyof SvgMapT,
	folder?: string,
): string => {
	if (!folder)
		throw new Error('rootFolder is required when not providing a path')
	return `${folder}/${String(file)}.svg`
}
