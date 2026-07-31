export const DEFAULT_NAMESPACE = "_RI"

/**
 * Id used for the `<defs>` entry a `type="link"` svg points its `<use>` at.
 * `namespace` keeps two configs in the same app from colliding.
 */
export const getSvgId = (namespace: string, svg: string): string =>
	`${namespace}-${svg}`
