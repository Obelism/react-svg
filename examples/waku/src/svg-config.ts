// No "use client" here on purpose: this module is imported by server
// components. `createSvgConfig` and `resolveSvgUrl` are pure, so they run on
// whichever side of the RSC boundary they're called from.
import { createSvgConfig, resolveSvgUrl } from "@obelism/react-svg"

export const SVG_MAP = {
	vercel: { width: 1155, height: 1000, alt: "Vercel logo" },
	next: { width: 394, height: 80, alt: "Next.js logo" },
}

export const svgConfig = createSvgConfig({
	svgMap: SVG_MAP,
	rootFolder: "/svgs",
})

export const getSvgUrl = (svg: keyof typeof SVG_MAP) =>
	resolveSvgUrl(svgConfig, svg)
