const DEFAULT_PREFIX = "_RI"

export type GetSvgId = (a: string) => string

export const resolveIdPrefix = (idPrefix?: string): string =>
	idPrefix || DEFAULT_PREFIX

export const getSvgIdGenerator =
	(idPrefix?: string): GetSvgId =>
	(key) =>
		`${resolveIdPrefix(idPrefix)}-${key}`
