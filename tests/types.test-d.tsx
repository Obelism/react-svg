import type React from "react"
import { describe, expectTypeOf, it } from "vitest"

import setupReactSvg, { createSvgConfig, Svg, SvgProvider } from "../dist/index"

const SVG_MAP = {
	arrowBack: { width: 800, height: 800, alt: "Back arrow" },
	logo: { path: "/logo.svg", width: 100, height: 20 },
}

const {
	Svg: BoundSvg,
	SvgProvider: BoundProvider,
	getSvgUrl,
	config: boundConfig,
} = setupReactSvg({
	svgMap: SVG_MAP,
	rootFolder: "/icons",
	svgRenderers: {
		nextImage: ({ svg, folder, entry }) => (
			<img
				src={`${folder}/${String(svg)}.svg`}
				width={entry.width}
				alt={String(svg)}
			/>
		),
	},
})

describe("setupReactSvg", () => {
	it("types the svg keys and the render types", () => {
		const _valid = (
			<BoundProvider config={boundConfig}>
				<BoundSvg svg="arrowBack" />
				<BoundSvg svg="logo" type="inline" />
				<BoundSvg svg="logo" type="nextImage" className="x" data-foo="bar" />
				{/* @ts-expect-error unknown svg key */}
				<BoundSvg svg="nope" />
				{/* @ts-expect-error unknown render type */}
				<BoundSvg svg="logo" type="nope" />
			</BoundProvider>
		)
	})

	it("requires the provider to be given a config", () => {
		// @ts-expect-error the provider no longer carries a pre-filled config
		const _missing = <BoundProvider>{null}</BoundProvider>
	})

	it("hands back a config shaped for the provider", () => {
		expectTypeOf(boundConfig.namespace).toEqualTypeOf<string>()
		expectTypeOf(boundConfig.svgMap).toEqualTypeOf<typeof SVG_MAP>()
	})

	it("keeps the documented React.ComponentProps escape hatch working", () => {
		type BoundSvgProps = React.ComponentProps<typeof BoundSvg>

		expectTypeOf<BoundSvgProps["svg"]>().toEqualTypeOf<"arrowBack" | "logo">()
	})

	it("types getSvgUrl against the svg map", () => {
		expectTypeOf(getSvgUrl("arrowBack")).toEqualTypeOf<string>()
		// @ts-expect-error unknown svg key
		getSvgUrl("nope")
	})
})

describe("plain components", () => {
	it("infers the svg map from the provider's config", () => {
		const config = createSvgConfig({
			svgMap: SVG_MAP,
			rootFolder: "/icons",
			namespace: "🦦",
		})

		const _valid = (
			<SvgProvider config={config}>
				<Svg svg="arrowBack" type="link" />
			</SvgProvider>
		)
	})

	it("does not accept options in place of a config", () => {
		const _invalid = (
			// @ts-expect-error the provider takes a resolved config, not raw options
			<SvgProvider svgMap={SVG_MAP} rootFolder="/icons">
				{null}
			</SvgProvider>
		)
	})

	it("infers the svg map from a config prop", () => {
		const config = createSvgConfig({ svgMap: SVG_MAP, rootFolder: "/icons" })

		const _valid = <Svg svg="logo" type="inline" config={config} />
		// @ts-expect-error unknown svg key
		const _invalid = <Svg svg="nope" config={config} />
	})
})
