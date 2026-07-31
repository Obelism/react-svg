import type { ReactNode } from "react"

import { getSvgUrl } from "../svg-config"

type RootLayoutProps = { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<div>
			{/* getSvgUrl runs here, in a server component, to preload a critical icon */}
			<link
				rel="preload"
				as="fetch"
				crossOrigin="anonymous"
				href={getSvgUrl("vercel")}
			/>

			{children}
		</div>
	)
}

export const getConfig = async () => {
	return { render: "dynamic" } as const
}
