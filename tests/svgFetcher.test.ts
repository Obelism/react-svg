import { afterEach, describe, expect, it, vi } from "vitest"

import {
	SvgFetchError,
	shouldRetrySvgFetch,
	svgFetcher,
} from "../src/functions/svgFetcher"

describe("svgFetcher", () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it("returns the body of a 2xx response", async () => {
		vi.stubGlobal("fetch", async () => new Response("<svg/>"))

		await expect(svgFetcher("/icon.svg")).resolves.toBe("<svg/>")
	})

	it("throws on a non-2xx response instead of returning its body", async () => {
		vi.stubGlobal(
			"fetch",
			async () => new Response("<html>Not found</html>", { status: 404 }),
		)

		await expect(svgFetcher("/icon.svg")).rejects.toMatchObject({
			name: "SvgFetchError",
			status: 404,
		})
	})
})

describe("shouldRetrySvgFetch", () => {
	const httpError = (status: number) =>
		new SvgFetchError("/icon.svg", status, "")

	it.each([400, 403, 404, 410])("does not retry a %i", (status) => {
		expect(shouldRetrySvgFetch(httpError(status))).toBe(false)
	})

	it.each([408, 429, 500, 503])("retries a %i", (status) => {
		expect(shouldRetrySvgFetch(httpError(status))).toBe(true)
	})

	it("retries a network error", () => {
		expect(shouldRetrySvgFetch(new TypeError("Failed to fetch"))).toBe(true)
	})
})
