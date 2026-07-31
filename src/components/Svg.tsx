"use client"

import type React from "react"
import { memo } from "react"

import { useSvgConfig } from "../config/SvgConfigContext"
import type {
	SvgConfig,
	SvgMap,
	SvgRenderer,
	SvgRenderMap,
} from "../config/types"
import { InlineSvg } from "./InlineSvg"
import { LinkedSvg } from "./LinkedSvg"
import { SvgImage } from "./SvgImage"

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
		const { svgMap, rootFolder, svgRenderers } = resolvedConfig
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

		if (type === "inline") {
			return (
				<InlineSvg
					{...rest}
					svg={key}
					alt={alt}
					onLoad={onLoad}
					config={resolvedConfig}
				/>
			)
		}

		if (type === "link") {
			return (
				<LinkedSvg
					{...rest}
					svg={key}
					alt={alt}
					onLoad={onLoad}
					config={resolvedConfig}
				/>
			)
		}

		const folder = rootFolder || ""

		if (type === "external") {
			return (
				<SvgImage
					{...rest}
					svg={key}
					entry={entry}
					folder={folder}
					loading={loading}
					alt={alt}
					onLoad={onLoad}
				/>
			)
		}

		const CustomSvg = svgRenderers?.[String(type)]

		if (CustomSvg) {
			return (
				<CustomSvg
					{...rest}
					svg={key}
					entry={entry}
					folder={folder}
					loading={loading}
					alt={alt}
					onLoad={onLoad}
				/>
			)
		}

		if (process.env.NODE_ENV !== "production") {
			console.error(
				`Svg - Unknown type provided; "${String(type)}", check your svgRenderers configuration`,
			)
		}

		return null
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
