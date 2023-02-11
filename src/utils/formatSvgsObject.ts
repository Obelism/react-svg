import { InputSvgsObj, CompleteSvgsObj } from './types'

const formatSvgPath = (file: string, folder?: string): string => {
	if (!folder) throw new Error('rootFolder is required when not passing a path')
	return `${folder}/${file}.svg`
}

export const formatSvgsObject = (
	svgs: InputSvgsObj,
	rootFolder?: string,
): CompleteSvgsObj => {
	return Object.entries(svgs).reduce((acc: CompleteSvgsObj, [key, value]) => {
		acc[key] = {
			path: value?.path || formatSvgPath(key, rootFolder),
			width: value?.width,
			height: value?.height,
			x: value?.x || 0,
			y: value?.y || 0,
			alt: value?.alt || '',
		}
		return acc
	}, {})
}
