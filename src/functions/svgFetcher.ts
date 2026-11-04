export class SvgFetchError extends Error {
	status: number

	constructor(path: string, status: number, statusText: string) {
		super(`react-svg - Failed to fetch "${path}": ${status} ${statusText}`)
		this.name = "SvgFetchError"
		this.status = status
	}
}

/**
 * Throws on a non-2xx response, so an error page is never injected as svg
 * markup.
 */
export const svgFetcher = async (path: string): Promise<string> => {
	const res = await fetch(path)

	if (!res.ok) throw new SvgFetchError(path, res.status, res.statusText)

	return await res.text()
}

const TRANSIENT_CLIENT_ERRORS = new Set([408, 429])

/** Most 4xx won't change on retry; network errors, 5xx, 408 and 429 might. */
export const shouldRetrySvgFetch = (error: Error): boolean =>
	!(error instanceof SvgFetchError) ||
	error.status >= 500 ||
	TRANSIENT_CLIENT_ERRORS.has(error.status)
