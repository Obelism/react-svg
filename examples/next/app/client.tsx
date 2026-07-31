"use client"

import { useState } from "react"
import { Svg } from "./Svg"

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
