import { SvgProvider } from "@obelism/react-svg"

import styles from "./stress.module.css"
import { stressConfig } from "./stress-config"

export default function StressLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	// A provider of its own, nested inside the root one: the svgs below read the
	// nearest config, and this one renders its own definitions block.
	return (
		<SvgProvider config={stressConfig}>
			<div className={styles.page}>{children}</div>
		</SvgProvider>
	)
}
