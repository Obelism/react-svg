const DEFAULT_PREFIX = "_RI"

export type GetSvgId = (a: string) => string

export const getSvgIdGenerator =
	(idPrefix?: string): GetSvgId =>
	(key) =>
		`${idPrefix || DEFAULT_PREFIX}-${key}`
