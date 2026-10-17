import Link from "next/link"

import styles from "./stress.module.css"
import { COUNTS, RENDER_TYPES } from "./stress-config"

export default function StressIndex() {
	return (
		<>
			<h1>Many svgs</h1>
			<p className={styles.lead}>
				Each page renders that many <code>&lt;Svg /&gt;</code>s and reports how
				long they took to settle. <strong>Distinct</strong> gives every svg its
				own file; <strong>same svg</strong> renders one file that many times.
				Following a link here measures a client-side navigation; reloading the
				page measures server rendering plus hydration.
			</p>

			<table className={styles.table}>
				<thead>
					<tr>
						<th>Type</th>
						{COUNTS.map((count) => (
							<th key={count}>{count}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{RENDER_TYPES.flatMap((type) => [
						<tr key={type}>
							<th>{type}</th>
							{COUNTS.map((count) => (
								<td key={count}>
									<Link href={`/stress/${type}/${count}`}>distinct</Link>
								</td>
							))}
						</tr>,
						<tr key={`${type}-same`}>
							<th>{type}, same svg</th>
							{COUNTS.map((count) => (
								<td key={count}>
									<Link href={`/stress/${type}/${count}?keys=1`}>same svg</Link>
								</td>
							))}
						</tr>,
					])}
				</tbody>
			</table>

			<p className={styles.lead}>
				<code>?keys=N</code> on any page cycles through N distinct svgs instead,
				e.g. <Link href="/stress/link/500?keys=50">500 svgs from 50 files</Link>
				.
			</p>
		</>
	)
}
