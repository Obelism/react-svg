import { shouldRetrySvgFetch } from "../functions/svgFetcher"

export const SWRConfig = Object.freeze({
	revalidateIfStale: false,
	revalidateOnFocus: false,
	revalidateOnReconnect: false,
	shouldRetryOnError: shouldRetrySvgFetch,
})
