// The one config this app has. No "use client" here on purpose: this module is
// imported by server and client components alike. `setupReactSvg` creates
// nothing — it resolves the config and narrows types — so it is safe to call
// from a server-safe module, and the `getSvgUrl` it returns is a real function
// rather than a client reference.
import setupReactSvg from "@obelism/react-svg"

import { ExternalLinkSvg } from "./ExternalLinkSvg"

export const SVG_MAP = {
	vercel: { width: 283, height: 64, alt: "Vercel logo" },
	next: { width: 394, height: 80, alt: "Next.js logo" },
}

export const {
	Svg,
	SvgProvider,
	config: svgConfig,
	getSvgUrl,
} = setupReactSvg({
	svgMap: SVG_MAP,
	rootFolder: "/",
	// A renderer is a component, so it has to be client code — but only the
	// renderer does. Naming one here keeps the config itself server-safe: the
	// import is a client reference, and it crosses the boundary the way any
	// other client component does.
	svgRenderers: {
		externalLink: ExternalLinkSvg,
	},
})
