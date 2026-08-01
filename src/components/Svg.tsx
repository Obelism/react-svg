"use client"

import type React from "react"
import { memo } from "react"

import { resolveSvgUrl } from "../_shared/resolveSvgUrl"
import { SvgConfigContext, useSvgConfig } from "../config/SvgConfigContext"
import type {
	SvgConfig,
	SvgMap,
	SvgRenderer,
	SvgRenderMap,
} from "../config/types"
import { InlineSvg } from "./InlineSvg"
import { LinkedSvg } from "./LinkedSvg"
import { SvgImage } from "./SvgImage"

/**
 * The built-in render types, as adapters at the same seam a consumer renderer
 * sits at. They take exactly the renderer props — the asymmetry is that they may
 * reach internal hooks, not that they receive more. Built-ins win over a
 * same-named consumer renderer, as they did when this was a branch per type.
 * See docs/adr/0004.
 */
const BUILT_IN_RENDERERS: Record<string, SvgRenderer<SvgMap>> = {
	link: LinkedSvg,
	inline: InlineSvg,
	external: SvgImage,
}

export type SvgProps<
	SvgMapT extends SvgMap = SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT> = Record<
		string,
		SvgRenderer<SvgMapT>
	>,
> = {
	svg: keyof SvgMapT
	type?: "link" | "inline" | "external" | keyof SvgRenderMapT
	alt?: string
	loading?: "lazy" | "eager"
	className?: string
	onLoad?: () => void
	// biome-ignore lint/suspicious/noExplicitAny: pass-through bag spread onto arbitrary host/custom elements; unknown breaks JSX spreading (verified via tsc)
	[x: string]: any
}

/** `<Svg />`'s own props plus the config it needs when it is used unbound. */
export type SvgComponentProps<
	SvgMapT extends SvgMap = SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT> = Record<
		string,
		SvgRenderer<SvgMapT>
	>,
> = SvgProps<SvgMapT, SvgRenderMapT> & {
	config?: SvgConfig<SvgMapT>
}

/**
 * The component type `setupReactSvg()` hands back: the same `<Svg />`, narrowed
 * to the svg keys and custom render types of a single config.
 */
export type SvgElement<
	SvgMapT extends SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT>,
> = (props: SvgProps<SvgMapT, SvgRenderMapT>) => React.JSX.Element | null

/**
 * Renders a single svg from the svg map. `type` picks how it gets on the page;
 * every other prop is passed straight through to the rendered element.
 */
const SvgComponent = memo(
	({
		type = "link",
		svg,
		alt,
		loading,
		onLoad,
		config,
		...rest
	}: SvgComponentProps) => {
		const resolvedConfig = useSvgConfig(config)
		const { svgMap, svgRenderers } = resolvedConfig
		const key = String(svg)
		const entry = svgMap[key]

		if (!entry) {
			if (process.env.NODE_ENV !== "production") {
				console.error(
					`Svg - Unknown svg provided; "${key}", check your svgMap configuration`,
				)
			}
			return null
		}

		// Resolved once, here, for every render type. Nothing below this line
		// knows how a key becomes a url.
		const url = resolveSvgUrl(resolvedConfig, key)

		const Renderer =
			BUILT_IN_RENDERERS[String(type)] || svgRenderers?.[String(type)]

		if (!Renderer) {
			if (process.env.NODE_ENV !== "production") {
				console.error(
					`Svg - Unknown type provided; "${String(type)}", check your svgRenderers configuration`,
				)
			}
			return null
		}

		const rendered = (
			<Renderer
				{...rest}
				svg={key}
				entry={entry}
				url={url}
				loading={loading}
				alt={alt}
				onLoad={onLoad}
			/>
		)

		// The `config` prop is an escape hatch (ADR-0002) and wins over context.
		// Re-providing it here means every adapter below reads the svg config the
		// same way on both paths, so none of them needs it as a prop.
		if (!config) return rendered

		return (
			<SvgConfigContext.Provider value={resolvedConfig}>
				{rendered}
			</SvgConfigContext.Provider>
		)
	},
)

SvgComponent.displayName = "Svg"

/**
 * The svg map (and custom render types) are inferred from the `config` prop, so
 * an unbound `<Svg />` type checks its `svg` key just like a bound one does.
 */
export const Svg = SvgComponent as <
	SvgMapT extends SvgMap = SvgMap,
	SvgRenderMapT extends SvgRenderMap<SvgMapT> = Record<
		string,
		SvgRenderer<SvgMapT>
	>,
>(
	props: SvgComponentProps<SvgMapT, SvgRenderMapT>,
) => React.JSX.Element | null
