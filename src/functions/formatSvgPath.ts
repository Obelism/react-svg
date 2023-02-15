export const formatSvgPath = (file: string, folder?: string): string => {
	if (!folder) throw new Error('rootFolder is required when not passing a path')
	return `${folder}/${file}.svg`
}
