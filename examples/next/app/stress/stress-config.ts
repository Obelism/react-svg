// The stress pages' own config, in its own namespace so its linked set and DOM
// ids never mix with the demo config in app/svg-config.ts. Server-safe for the
// same reason that one is: no "use client", nothing created.
import setupReactSvg from "@obelism/react-svg"

/** The largest page there is, and so the number of distinct svgs available. */
export const MAX_SVGS = 2000

export const COUNTS = [50, 100, 250, 500, 1000, 2000]

export const RENDER_TYPES = ["link", "inline", "external"] as const

export type StressRenderType = (typeof RENDER_TYPES)[number]

export const STRESS_NAMESPACE = "stress"

// Every entry points at its own generated file (app/stress-svg), so a page can
// ask for as many distinct svgs as it renders — distinct linked svgs are what
// grow the linked set.
const svgMap = Object.fromEntries(
	Array.from({ length: MAX_SVGS }, (_, i) => [
		`s${i}`,
		{
			width: 24,
			height: 24,
			alt: `Stress svg ${i}`,
			path: `/stress-svg/s${i}.svg`,
		},
	]),
)

export const { Svg: StressSvg, config: stressConfig } = setupReactSvg({
	namespace: STRESS_NAMESPACE,
	svgMap,
})
