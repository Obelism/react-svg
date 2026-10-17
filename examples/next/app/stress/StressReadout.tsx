"use client"

import { useEffect, useState } from "react"

import styles from "./stress.module.css"
import { STRESS_NAMESPACE, type StressRenderType } from "./stress-config"

type Result = {
	type: StressRenderType
	count: number
	keys: number
	/** From this readout's first render to every svg showing its markup. */
	settledMs: number
	/** The same moment, measured from navigation start. */
	sinceNavigationMs: number
	longTasks: number
	longTaskMs: number
	longestTaskMs: number
}

declare global {
	interface Window {
		/** The last settled result, for reading from a headless browser. */
		__stressResult?: Result
	}
}

/** How many of the page's svgs have their markup, per render type. */
const countSettled = (type: StressRenderType): number => {
	if (type === "link") {
		// One definition per distinct svg, rendered once its markup arrived.
		return document.querySelectorAll(`g[id^="${STRESS_NAMESPACE}-"]`).length
	}
	if (type === "inline") {
		return document.querySelectorAll("[data-stress-grid] > svg > g").length
	}
	return Array.from(
		document.querySelectorAll<HTMLImageElement>("[data-stress-grid] > img"),
	).filter((img) => img.complete && img.naturalWidth > 0).length
}

/**
 * Times how long the page's svgs take to settle, and how much of that the main
 * thread spent blocked. Long tasks are only reported by Chromium browsers.
 */
export const StressReadout = ({
	type,
	count,
	keys,
}: {
	type: StressRenderType
	count: number
	keys: number
}) => {
	const [start] = useState(() => performance.now())
	const [settled, setSettled] = useState(0)
	const [result, setResult] = useState<Result | null>(null)

	useEffect(() => {
		const expected = type === "link" ? keys : count
		const longTasks: PerformanceEntry[] = []
		let observer: PerformanceObserver | undefined

		try {
			observer = new PerformanceObserver((list) => {
				longTasks.push(...list.getEntries())
			})
			observer.observe({ type: "longtask", buffered: true })
		} catch {
			// Not supported outside Chromium; the timing still works.
		}

		let frame = 0
		const poll = () => {
			const now = countSettled(type)
			setSettled(now)

			if (now < expected) {
				frame = requestAnimationFrame(poll)
				return
			}

			const end = performance.now()
			const during = longTasks.filter(
				(task) => task.startTime + task.duration >= start,
			)
			const next: Result = {
				type,
				count,
				keys,
				settledMs: Math.round(end - start),
				sinceNavigationMs: Math.round(end),
				longTasks: during.length,
				longTaskMs: Math.round(
					during.reduce((total, task) => total + task.duration, 0),
				),
				longestTaskMs: Math.round(
					during.reduce((longest, task) => Math.max(longest, task.duration), 0),
				),
			}
			window.__stressResult = next
			console.info("[stress]", next)
			setResult(next)
			observer?.disconnect()
		}

		frame = requestAnimationFrame(poll)

		return () => {
			cancelAnimationFrame(frame)
			observer?.disconnect()
		}
	}, [type, count, keys, start])

	const expected = type === "link" ? keys : count

	return (
		<dl
			className={styles.readout}
			data-stress-settled={result ? "" : undefined}
		>
			<div>
				<dt>{type === "link" ? "Definitions loaded" : "Svgs loaded"}</dt>
				<dd>
					{settled} / {expected}
				</dd>
			</div>
			<div>
				<dt>Settled after</dt>
				<dd>{result ? `${result.settledMs} ms` : "…"}</dd>
			</div>
			<div>
				<dt>Since navigation start</dt>
				<dd>{result ? `${result.sinceNavigationMs} ms` : "…"}</dd>
			</div>
			<div>
				<dt>Long tasks</dt>
				<dd>
					{result
						? `${result.longTasks} · ${result.longTaskMs} ms total · ${result.longestTaskMs} ms longest`
						: "…"}
				</dd>
			</div>
		</dl>
	)
}
