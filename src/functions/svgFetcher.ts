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
export const svgFetcher = async (path: string) => {
	const res = await fetch(path)

	if (!res.ok) throw new SvgFetchError(path, res.status, res.statusText)

	return await res.text()
}

/** A 4xx won't change on retry; network errors and 5xx might. */
export const shouldRetrySvgFetch = (error: Error) =>
	!(error instanceof SvgFetchError && error.status < 500)
