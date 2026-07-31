// No "use client" here on purpose: this module is imported by server
// components. `setupReactSvg` creates nothing — it resolves the config and
// narrows types — so it is safe to call from a server-safe module, and the
// `getSvgUrl` it returns is a real function rather than a client reference.
import setupReactSvg from "@obelism/react-svg"

export const SVG_MAP = {
	vercel: { width: 283, height: 64, alt: "Vercel logo" },
	next: { width: 394, height: 80, alt: "Next.js logo" },
}

// A distinct namespace: this config is rendered next to the one from
// setupReactSvg() in app/Svg.tsx, and two providers sharing a namespace share
// their <defs> ids.
export const {
	Svg: RscSvgComponent,
	SvgProvider: RscSvgProvider,
	config: svgConfig,
	getSvgUrl,
} = setupReactSvg({
	svgMap: SVG_MAP,
	rootFolder: "/",
	namespace: "_rsc",
})
