"use client"

import type { SvgRendererProps } from "@obelism/react-svg"

import type { SVG_MAP } from "../svg-config"

/**
 * A custom render type. Renderers are components, so this module carries the
 * "use client" directive — and it is the only file in this example that has to.
 * Everything it needs arrives as props, including the already-resolved `url`.
 */
export const FramedSvg = ({ url, alt }: SvgRendererProps<typeof SVG_MAP>) => (
	<span data-testid="custom-renderer" style={{ border: "1px solid" }}>
		<img src={url} alt={alt} width={32} />
	</span>
)
