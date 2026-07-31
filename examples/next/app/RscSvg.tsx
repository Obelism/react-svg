// A server component: the components come from a server-safe module that
// called setupReactSvg(), and they render straight from here — no "use client"
// wrapper of our own. Their svg keys are typed against that config.
import {
	RscSvgComponent as Svg,
	RscSvgProvider as SvgProvider,
	svgConfig,
} from "./svg-config"

export const RscSvg = ({ className }: { className?: string }) => (
	<SvgProvider config={svgConfig}>
		<Svg svg="next" type="link" className={className} data-testid="rsc-link" />
		<Svg
			svg="vercel"
			type="external"
			className={className}
			data-testid="rsc-external"
		/>
	</SvgProvider>
)
