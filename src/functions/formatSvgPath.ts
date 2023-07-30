import { SvgListT } from 'config/types'

export const formatSvgPath = <T extends SvgListT>(
	file: keyof T,
	folder?: string,
): string => {
	if (!folder) throw new Error('rootFolder is required when not passing a path')
	return `${folder}/${String(file)}.svg`
}
