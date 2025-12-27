"use client"

import { useState } from "react"
import { Svg } from "./Svg"

export const VercelSvg = (props: any) => {
	const [loaded, setLoaded] = useState(false)
	return (
		<Svg
			{...props}
			style={{ opacity: loaded ? 1 : 0 }}
			svg="vercel"
			type="link"
			onLoad={() => setLoaded(true)}
		/>
	)
}
