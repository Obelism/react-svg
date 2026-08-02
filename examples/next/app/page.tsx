import { VercelSvg } from "./client"
import styles from "./page.module.css"
import { Svg } from "./svg-config"

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<p>
					Get started by editing&nbsp;
					<code className={styles.code}>app/page.tsx</code>
				</p>
				<div>
					<a
						href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						By
						<VercelSvg className={styles.vercelLogo} />
					</a>
				</div>
			</div>

			{/* This is a server component: no "use client" wrapper of our own,
			    no provider of its own. The svg keys and render types below are
			    still typed against the config in app/svg-config.ts. */}
			<div className={styles.center}>
				<Svg
					className={styles.logo}
					svg="next"
					type="link"
					data-testid="rsc-link"
				/>
				<Svg
					className={styles.logo}
					svg="next"
					type="inline"
					data-testid="rsc-inline"
				/>
				<Svg
					className={styles.logo}
					svg="next"
					type="external"
					data-testid="rsc-external"
				/>
				{/* A custom render type, from the same config */}
				<Svg
					className={styles.logo}
					svg="next"
					type="externalLink"
					data-testid="rsc-custom"
				/>
			</div>

			<div className={styles.grid}>
				<a
					href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Docs <span>-&gt;</span>
					</h2>
					<p>Find in-depth information about Next.js features and API.</p>
				</a>

				<a
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Learn <span>-&gt;</span>
					</h2>
					<p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
				</a>

				<a
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Templates <span>-&gt;</span>
					</h2>
					<p>Explore starter templates for Next.js.</p>
				</a>

				<a
					href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Deploy <span>-&gt;</span>
					</h2>
					<p>
						Instantly deploy your Next.js site to a shareable URL with Vercel.
					</p>
				</a>
			</div>
		</main>
	)
}
