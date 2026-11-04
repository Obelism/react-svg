import type React from "react"
import { formatSvgViewBox } from "../_shared/formatSvgViewBox"
import type { SvgEntry } from "../config/types"

export type BaseSvgProps = {
	entry: SvgEntry
	alt?: string
	children?: React.ReactNode
	// biome-ignore lint/suspicious/noExplicitAny: pass-through bag spread onto the <svg> element; unknown breaks JSX spreading (verified via tsc)
	[x: string]: any
}

/**
 * The `<svg>` wrapper shared by the inline and link render types: it applies the
 * viewBox from the svg map and renders the alt text, if any, as a `<title>`.
 */
export const BaseSvg = ({ entry, alt, children, ...rest }: BaseSvgProps) => {
	const title = alt || entry.alt

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: title only when alt is set; consumers label or hide it via passed-through aria props
		<svg {...rest} viewBox={formatSvgViewBox(entry)} xmlSpace="preserve">
			{title ? <title>{title}</title> : null}
			{children}
		</svg>
	)
}

BaseSvg.displayName = "BaseSvg"
