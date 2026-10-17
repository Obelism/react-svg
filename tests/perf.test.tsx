import { cleanup, render, waitFor } from "@testing-library/react"
import { Profiler } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createSvgConfig, Svg, SvgProvider } from "../dist/index.mjs"

/**
 * Pages with hundreds of svgs. These pin how the render cost grows with the
 * number of svgs, not how fast a given machine is: commit counts are exact, and
 * the time budgets sit an order of magnitude away from both the fixed and the
 * regressed numbers.
 *
 * Measure a single scenario at another size with:
 *   PERF_N=2000 npx vitest run tests/perf.test.tsx --silent=false
 */

const N = Number(process.env.PERF_N ?? 500)

let run = 0

/** A fresh namespace and folder per scenario, so SWR's cache never carries over. */
const makeConfig = (distinct: number) => {
	run++
	const svgMap: Record<string, { width: number; height: number }> = {}
	for (let i = 0; i < distinct; i++) svgMap[`s${i}`] = { width: 10, height: 10 }
	return createSvgConfig({
		namespace: `perf${run}`,
		rootFolder: `/perf${run}`,
		svgMap,
	})
}

/** Renders `N` svgs cycling through `distinct` keys, until every one has markup. */
const measure = async (type: string, distinct: number) => {
	const config = makeConfig(distinct)
	let commits = 0
	let renderMs = 0

	const start = performance.now()
	const { container } = render(
		<Profiler
			id="perf"
			onRender={(_id, _phase, actualDuration) => {
				commits++
				renderMs += actualDuration
			}}
		>
			<SvgProvider config={config}>
				{Array.from({ length: N }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: a static list
					<Svg key={i} type={type} svg={`s${i % distinct}`} />
				))}
			</SvgProvider>
		</Profiler>,
	)

	await waitFor(
		() => {
			const groups = container.querySelectorAll(
				type === "link" ? "defs > g" : "svg > g",
			)
			expect(groups.length).toBe(type === "link" ? distinct : N)
		},
		{ timeout: 60_000, interval: 5 },
	)

	const result = {
		type,
		svgs: N,
		distinct,
		commits,
		renderMs: Math.round(renderMs),
		wallMs: Math.round(performance.now() - start),
		fetches: vi.mocked(fetch).mock.calls.length,
	}
	console.log(JSON.stringify(result))
	return result
}

describe("rendering many svgs", () => {
	beforeEach(() => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response('<path d="M0 0h10v10H0z"/>')),
		)
	})

	afterEach(() => {
		cleanup()
		vi.unstubAllGlobals()
	})

	// Every linked svg used to add itself to the linked set from the set it saw
	// at render time, so of all the svgs registering in one commit only the last
	// write survived — one svg joined per commit, and every commit re-rendered
	// every linked svg on the page.
	it("links many distinct svgs in a constant number of commits", async () => {
		const { commits, fetches } = await measure("link", N)

		expect(fetches).toBe(N)
		expect(commits).toBeLessThan(10)
	}, 120_000)

	// Every linked svg also used to subscribe to the whole set, so each write
	// made every one of them deep-compare it: N writes × N subscribers × N keys.
	// That cost no commits — only time (14s for 500 svgs; 0.4s without it).
	it("links many distinct svgs without comparing the set per svg", async () => {
		const { wallMs } = await measure("link", N)

		expect(wallMs).toBeLessThan(5_000)
	}, 120_000)

	it.each([
		["link", 50],
		["link", 1],
		["inline", N],
		["inline", 1],
	])(
		"renders %s svgs from %i distinct keys",
		async (type, distinct) => {
			const { commits, fetches } = await measure(type, distinct)

			expect(fetches).toBe(distinct)
			expect(commits).toBeLessThan(10)
		},
		120_000,
	)
})
