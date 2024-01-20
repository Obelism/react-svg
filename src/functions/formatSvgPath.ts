import { SvgMap } from 'config/types'

export const formatSvgPath = <SvgMapT extends SvgMap>(
	file: keyof SvgMapT,
	folder?: string,
): string => {
	if (typeof folder !== 'string')
		throw new Error(
			'SvgProvider - rootFolder is required when not providing a path to svg entries',
		)
	return `${folder}${folder.at(-1) === '/' ? '' : '/'}${String(file)}.svg`
}
