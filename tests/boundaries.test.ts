import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

const DIST = join(import.meta.dirname, "..", "dist")

const read = (file: string) => readFileSync(join(DIST, file), "utf8")
const isClientModule = (source: string) =>
	/^["']use client["']/.test(source.trimStart())

/** Every `./…` chunk the entry pulls in, in either module format. */
const chunkSpecifiers = (entry: string) =>
	[...entry.matchAll(/(?:from|require\()\s*["'](\.\/[^"']+)["']/g)].map(
		(match) => match[1] as string,
	)

/** The public pure helpers. The internal ones have no re-export to check. */
const PURE_HELPERS = ["createSvgConfig", "resolveSvgUrl", "formatSvgPath"]

const COMPONENT_CHUNK =
	/^(Svg|SvgProvider|SvgGroup|SvgImage|InlineSvg|LinkedSvg)-/

/**
 * Both formats are published, and a consumer on either one gets the same
 * boundary promises — so both are asserted. `.mjs` chunks back the ESM entry,
 * `.js` chunks back the CommonJS one.
 */
const FORMATS = [
	{ label: "esm", entry: "index.mjs", chunkExt: ".mjs" },
	{ label: "cjs", entry: "index.cjs", chunkExt: ".js" },
]

/**
 * React server components resolve the client boundary per module. If a pure
 * helper ends up inside a "use client" chunk it becomes a client reference, and
 * calling it during a server render throws. These assertions pin the split that
 * `examples/waku` and `examples/next` depend on.
 */
describe("package boundaries", () => {
	describe.each(FORMATS)("$label", ({ entry, chunkExt }) => {
		it("keeps the entry itself server-safe", () => {
			expect(isClientModule(read(entry))).toBe(false)
		})

		it("reaches the pure helpers through server-safe chunks", () => {
			const specifiers = chunkSpecifiers(read(entry))

			for (const helper of PURE_HELPERS) {
				const source = specifiers.find((specifier) =>
					read(specifier).includes(helper),
				)

				expect(source, `${helper} is not reachable from ${entry}`).toBeTruthy()
				expect(
					isClientModule(read(source as string)),
					`${helper} comes from a "use client" chunk, so a server component can't call it`,
				).toBe(false)
			}
		})

		it("ships the components as client modules", () => {
			const componentChunks = readdirSync(DIST).filter(
				(file) => COMPONENT_CHUNK.test(file) && file.endsWith(chunkExt),
			)

			expect(
				componentChunks.length,
				`no ${chunkExt} component chunks found — the split may have collapsed`,
			).toBeGreaterThan(0)

			for (const chunk of componentChunks) {
				expect(isClientModule(read(chunk)), `${chunk} lost its directive`).toBe(
					true,
				)
			}
		})
	})

	it("keeps the internals off the public surface", () => {
		const types = read("index.d.ts")

		// Their props are resolved internals, so exporting them would freeze that
		// shape as a compatibility promise. See docs/adr/0003.
		for (const internal of [
			"BaseSvg",
			"InlineSvg",
			"LinkedSvg",
			"SvgGroup",
			"SvgImage",
			"getSvgId",
			"formatSvgViewBox",
			"SvgConfigContext",
			"useSvgConfig",
			"SvgElementArgs",
			"SetupReactSvgArgs",
		]) {
			expect(
				new RegExp(`\\b${internal}\\b`).test(types),
				`${internal} is internal but still reachable from the published types`,
			).toBe(false)
		}
	})
})
