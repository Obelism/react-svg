"use client"

import { useState } from "react"

// The same config module a server component imports — nothing here is a second
// config, and no provider of its own is needed.
import { Svg } from "./svg-config"

export const VercelSvg = ({ className }: { className?: string }) => {
	const [loaded, setLoaded] = useState(false)

	return (
		<Svg
			className={className}
			style={{ opacity: loaded ? 1 : 0 }}
			svg="vercel"
			type="link"
			onLoad={() => setLoaded(true)}
		/>
	)
}
