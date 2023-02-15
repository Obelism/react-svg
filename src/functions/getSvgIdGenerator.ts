const DEFAULT_PREFIX = '_RI'

export type GetSvgId = (a: string) => string

export const getSvgIdGenerator =
	(idPrefix?: string): GetSvgId =>
	(key: string): string =>
		`${idPrefix || DEFAULT_PREFIX}-${key}`
