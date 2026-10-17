import Link from "next/link"
import { notFound } from "next/navigation"
import { StressReadout } from "../../StressReadout"
import styles from "../../stress.module.css"
import {
	MAX_SVGS,
	RENDER_TYPES,
	type StressRenderType,
	StressSvg,
} from "../../stress-config"

const isRenderType = (type: string): type is StressRenderType =>
	(RENDER_TYPES as readonly string[]).includes(type)

const parseCount = (value: string | undefined, fallback: number) => {
	const count = Number(value ?? fallback)
	return Number.isInteger(count) && count >= 1 && count <= MAX_SVGS
		? count
		: null
}

export default async function StressPage({
	params,
	searchParams,
}: {
	params: Promise<{ type: string; count: string }>
	searchParams: Promise<{ keys?: string }>
}) {
	const { type, count: rawCount } = await params
	const { keys: rawKeys } = await searchParams

	const count = parseCount(rawCount, 0)
	if (!isRenderType(type) || count === null) notFound()

	const keys = Math.min(parseCount(rawKeys, count) ?? count, count)

	return (
		<>
			<p>
				<Link href="/stress">← all pages</Link>
			</p>
			<h1>
				{count} × {type}, {keys === 1 ? "same svg" : `${keys} distinct`}
			</h1>

			{/* Rendered before the grid, so it starts its clock before the grid
			    renders on a client-side navigation. The key restarts it when only
			    the search params change. */}
			<StressReadout
				key={`${type}-${count}-${keys}`}
				type={type}
				count={count}
				keys={keys}
			/>

			{/* A server component: every svg here is rendered on the server and
			    hydrated, the way a real page full of icons would be. */}
			<div className={styles.grid} data-stress-grid="">
				{Array.from({ length: count }, (_, i) => (
					<StressSvg
						// biome-ignore lint/suspicious/noArrayIndexKey: a static list
						key={i}
						className={styles.icon}
						svg={`s${i % keys}`}
						type={type}
						// Lazy images below the fold would never load, and the
						// readout waits for every svg.
						loading="eager"
					/>
				))}
			</div>
		</>
	)
}
