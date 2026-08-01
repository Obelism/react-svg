import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import setupReactSvg, {
	createSvgConfig,
	resolveSvgUrl,
	Svg,
	SvgProvider,
} from "../dist/index.mjs"

describe("setupReactSvg", () => {
	const { Svg, SvgProvider, getSvgUrl, config } = setupReactSvg({
		namespace: "🧪",
		rootFolder: "/path/to",
		svgMap: {
			icon: {
				height: 16,
				width: 9,
				alt: "Icon",
			},
			iconWithPath: {
				path: "/custom/place/icon.svg",
				height: 16,
				width: 9,
				alt: "Icon with path",
			},
		},
		svgRenderers: {
			customElement: ({ url }) => (
				<div id="customElement">
					<img src={url} alt="Custom alt tag" />
				</div>
			),
		},
	})

	it("Image with default alt", () => {
		const { getByAltText } = render(
			<SvgProvider config={config}>
				<Svg type="external" svg="icon" />
			</SvgProvider>,
		)
		getByAltText("Icon")
		cleanup()
	})

	it("Image with alt overwrite", () => {
		const { getByAltText } = render(
			<SvgProvider config={config}>
				<Svg type="external" svg="icon" alt="Something different" />
			</SvgProvider>,
		)
		getByAltText("Something different")
		cleanup()
	})

	it("SVG inline default alt", () => {
		const { getByTitle, container } = render(
			<SvgProvider config={config}>
				<Svg type="inline" svg="icon" />
			</SvgProvider>,
		)
		getByTitle("Icon")
		const svgs = container.querySelectorAll("svg")
		expect(svgs.length).toBe(1)
		cleanup()
	})

	it("SVG inline alt overwrite", () => {
		const { getByTitle, container } = render(
			<SvgProvider config={config}>
				<Svg type="inline" svg="icon" alt="Something different" />
			</SvgProvider>,
		)
		getByTitle("Something different")
		const svgs = container.querySelectorAll("svg")
		expect(svgs.length).toBe(1)
		cleanup()
	})

	it("SVG link default alt", () => {
		const { getByTitle, container } = render(
			<SvgProvider config={config}>
				<Svg type="link" svg="icon" />
			</SvgProvider>,
		)

		getByTitle("Icon")
		const use = container.querySelector("use")
		expect(!!use).toBe(true)
		cleanup()
	})

	it("SVG link alt overwrite", () => {
		const { getByTitle, container } = render(
			<SvgProvider config={config}>
				<Svg type="link" svg="icon" alt="🪩" />
			</SvgProvider>,
		)

		getByTitle("🪩")
		const use = container.querySelector("use")
		expect(!!use).toBe(true)
		cleanup()
	})

	it("Custom element", () => {
		const { getByAltText, container } = render(
			<SvgProvider config={config}>
				<Svg type="customElement" svg="icon" />
			</SvgProvider>,
		)

		getByAltText("Custom alt tag")
		const use = container.querySelector("#customElement")
		expect(!!use).toBe(true)
		cleanup()
	})

	it("hands renderers the resolved url", () => {
		const { getByAltText } = render(
			<SvgProvider config={config}>
				<Svg type="customElement" svg="icon" />
			</SvgProvider>,
		)

		expect(getByAltText("Custom alt tag").getAttribute("src")).toBe(
			"/path/to/icon.svg",
		)
		cleanup()
	})

	// Under the v2 protocol a renderer was handed `folder` and joined the
	// filename itself, so an entry's `path` override was silently ignored by
	// every custom render type. Resolving the url before it crosses the seam is
	// what fixes that.
	it("hands renderers the per-entry path override", () => {
		const { getByAltText } = render(
			<SvgProvider config={config}>
				<Svg type="customElement" svg="iconWithPath" />
			</SvgProvider>,
		)

		expect(getByAltText("Custom alt tag").getAttribute("src")).toBe(
			"/custom/place/icon.svg",
		)
		cleanup()
	})

	it("external respects the per-entry path override", () => {
		const { getByAltText } = render(
			<SvgProvider config={config}>
				<Svg type="external" svg="iconWithPath" />
			</SvgProvider>,
		)

		expect(getByAltText("Icon with path").getAttribute("src")).toBe(
			"/custom/place/icon.svg",
		)
		cleanup()
	})

	// Every render type is handed the same props now, including `loading`.
	// `<svg>` has no such attribute, so the adapters that ignore it must drop
	// it rather than let it through with the pass-through bag.
	it.each([
		"inline",
		"link",
	])("does not leak loading onto the %s svg element", (type) => {
		const { container } = render(
			<SvgProvider config={config}>
				<Svg type={type} svg="icon" loading="lazy" data-target="" />
			</SvgProvider>,
		)

		// Not `querySelector("svg")`: the provider's <defs> block is an <svg>
		// too, and it comes first in the DOM.
		const target = container.querySelector("svg[data-target]")

		expect(target).not.toBeNull()
		expect(target?.hasAttribute("loading")).toBe(false)
		cleanup()
	})

	it("getSvgUrl falls back to rootFolder", () => {
		expect(getSvgUrl("icon")).toBe("/path/to/icon.svg")
	})

	it("getSvgUrl uses the per-entry path override", () => {
		expect(getSvgUrl("iconWithPath")).toBe("/custom/place/icon.svg")
	})

	it("getSvgUrl throws for an unknown svg key", () => {
		// @ts-expect-error - intentionally an invalid key to test the runtime guard
		expect(() => getSvgUrl("doesNotExist")).toThrow(/Unknown svg provided/)
	})
})

describe("Svg / SvgProvider as plain components", () => {
	const SVG_MAP = {
		icon: { height: 16, width: 9, alt: "Icon" },
	}

	it("takes its config from the provider", () => {
		const config = createSvgConfig({ svgMap: SVG_MAP, rootFolder: "/path/to" })

		const { getByAltText } = render(
			<SvgProvider config={config}>
				<Svg type="external" svg="icon" />
			</SvgProvider>,
		)

		expect(getByAltText("Icon").getAttribute("src")).toBe("/path/to/icon.svg")
		cleanup()
	})

	it("defaults to the link type and uses the configured namespace", () => {
		const config = createSvgConfig({
			svgMap: SVG_MAP,
			rootFolder: "/path/to",
			namespace: "🧪",
		})

		const { getByTitle, container } = render(
			<SvgProvider config={config}>
				<Svg svg="icon" />
			</SvgProvider>,
		)

		getByTitle("Icon")
		expect(container.querySelector("use")?.getAttribute("href")).toBe(
			"#🧪-icon",
		)
		cleanup()
	})

	it("takes a config prop without a provider", () => {
		const config = createSvgConfig({ svgMap: SVG_MAP, rootFolder: "/path/to" })

		const { getByTitle, container } = render(
			<Svg type="inline" svg="icon" config={config} alt="Inline icon" />,
		)

		getByTitle("Inline icon")
		expect(container.querySelectorAll("svg").length).toBe(1)
		cleanup()
	})

	it("throws a helpful error without a config", () => {
		expect(() => render(<Svg type="inline" svg="icon" />)).toThrow(
			/No svg config found/,
		)
		cleanup()
	})

	it("only defines the svgs from its own map when two configs share a namespace", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string) => ({
				text: async () => `<path data-url="${url}" />`,
			})),
		)

		const first = setupReactSvg({
			rootFolder: "/first",
			svgMap: { alpha: { width: 1, height: 1 } },
		})
		const second = setupReactSvg({
			rootFolder: "/second",
			svgMap: { beta: { width: 1, height: 1 } },
		})

		const { container } = render(
			<>
				<first.SvgProvider config={first.config}>
					<first.Svg svg="alpha" type="link" />
				</first.SvgProvider>
				<second.SvgProvider config={second.config}>
					<second.Svg svg="beta" type="link" />
				</second.SvgProvider>
			</>,
		)

		await waitFor(() => {
			expect(container.querySelectorAll("defs > g").length).toBe(2)
		})

		const ids = [...container.querySelectorAll("defs > g")]
			.map((group) => group.id)
			.sort()

		expect(ids).toEqual(["_RI-alpha", "_RI-beta"])

		vi.unstubAllGlobals()
		cleanup()
	})

	it("exports only the supported runtime surface", async () => {
		const pkg = await import("../dist/index.mjs")

		expect(Object.keys(pkg).sort()).toEqual([
			"Svg",
			"SvgProvider",
			"createSvgConfig",
			"default",
			"formatSvgPath",
			"resolveSvgUrl",
			"setupReactSvg",
		])
	})

	it("resolveSvgUrl works on a standalone config", () => {
		const config = createSvgConfig({ svgMap: SVG_MAP, rootFolder: "/path/to" })

		expect(resolveSvgUrl(config, "icon")).toBe("/path/to/icon.svg")
	})
})

describe("onLoad", () => {
	// Each case gets its own namespace *and* rootFolder. The linked set is shared
	// by namespace and the fetched markup is cached by url, so two cases sharing
	// either one are not independent.
	const makeConfig = (id: string) =>
		setupReactSvg({
			namespace: `ns-${id}`,
			rootFolder: `/${id}`,
			svgMap: { icon: { width: 1, height: 1, alt: "Icon" } },
		})

	beforeEach(() => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => ({ text: async () => "<path/>" })),
		)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
		cleanup()
	})

	it("fires for an inline render", async () => {
		const { Svg, SvgProvider, config } = makeConfig("inline")
		const onLoad = vi.fn()

		render(
			<SvgProvider config={config}>
				<Svg type="inline" svg="icon" onLoad={onLoad} />
			</SvgProvider>,
		)

		await waitFor(() => {
			expect(onLoad).toHaveBeenCalledTimes(1)
		})
	})

	it("fires once for an inline render, not on every render", async () => {
		const { Svg, SvgProvider, config } = makeConfig("inline-once")
		const onLoad = vi.fn()

		const tree = (
			<SvgProvider config={config}>
				<Svg type="inline" svg="icon" onLoad={onLoad} />
			</SvgProvider>
		)

		const { rerender } = render(tree)
		await waitFor(() => {
			expect(onLoad).toHaveBeenCalledTimes(1)
		})

		rerender(tree)
		rerender(tree)

		expect(onLoad).toHaveBeenCalledTimes(1)
	})

	it("fires for a link render once the definitions block is populated", async () => {
		const { Svg, SvgProvider, config } = makeConfig("link")
		const onLoad = vi.fn()

		const { container } = render(
			<SvgProvider config={config}>
				<Svg type="link" svg="icon" onLoad={onLoad} />
			</SvgProvider>,
		)

		// The markup has not arrived on the first paint, so neither has onLoad.
		expect(onLoad).not.toHaveBeenCalled()

		await waitFor(() => {
			expect(container.querySelector("defs > g")).not.toBeNull()
		})

		await waitFor(() => {
			expect(onLoad).toHaveBeenCalledTimes(1)
		})
	})

	it("fires for an external render when the image loads", () => {
		const { Svg, SvgProvider, config } = makeConfig("external")
		const onLoad = vi.fn()

		const { getByAltText } = render(
			<SvgProvider config={config}>
				<Svg type="external" svg="icon" onLoad={onLoad} />
			</SvgProvider>,
		)

		// jsdom never loads an <img> on its own, so this has to be driven.
		expect(onLoad).not.toHaveBeenCalled()

		fireEvent.load(getByAltText("Icon"))

		expect(onLoad).toHaveBeenCalledTimes(1)
	})

	// Pinning current behaviour, not endorsing it: an inline render both writes
	// the linked set and fills the url-keyed cache, so a later link render of the
	// same key reports loaded without fetching anything itself. The linked set
	// work has to preserve this or change it knowingly.
	it("a prior inline render makes a later link render fire onLoad with no fetch of its own", async () => {
		const { Svg, SvgProvider, config } = makeConfig("cross")

		const first = render(
			<SvgProvider config={config}>
				<Svg type="inline" svg="icon" />
			</SvgProvider>,
		)
		await waitFor(() => {
			expect(first.container.querySelector("svg > g")).not.toBeNull()
		})
		cleanup()

		const deadFetch = vi.fn(() => new Promise(() => {}))
		vi.stubGlobal("fetch", deadFetch)

		const onLoad = vi.fn()
		render(
			<SvgProvider config={config}>
				<Svg type="link" svg="icon" onLoad={onLoad} />
			</SvgProvider>,
		)

		await waitFor(() => {
			expect(onLoad).toHaveBeenCalledTimes(1)
		})
		expect(deadFetch).not.toHaveBeenCalled()
	})
})
