"use client"

import type React from "react"
import { memo } from "react"

import { getSvgId } from "../_shared/getSvgId"
import { SvgConfigContext } from "../config/SvgConfigContext"
import type { SvgConfig, SvgMap } from "../config/types"
import { useLinkedSvgList } from "../functions/useSvgLoaded"
import { SvgGroup } from "./SvgGroup"

export type SvgProviderProps<SvgMapT extends SvgMap = SvgMap> = {
	config: SvgConfig<SvgMapT>
	children?: React.ReactNode
}

/**
 * Makes the config available to every `<Svg />` below it, and renders the
 * `<defs>` block that the `type="link"` svgs point their `<use>` at.
 *
 * Build the config once with `createSvgConfig()`, or take it from
 * `setupReactSvg()`. Resolving raw options here instead would hand every svg
 * below a freshly identified config on each render.
 */
const SvgProviderComponent = memo(({ config, children }: SvgProviderProps) => {
	const [linkedSvgList] = useLinkedSvgList(config.namespace)

	// The linked list is shared by namespace, so two providers configured with
	// the same namespace see each other's keys. Only define the svgs this
	// provider actually knows about, or it renders (and fetches) svgs from a
	// different svg map under duplicate ids.
	const referencedKeys = linkedSvgList
		? Object.keys(linkedSvgList).filter((svg) => svg in config.svgMap)
		: []

	return (
		<SvgConfigContext.Provider value={config}>
			{referencedKeys.length > 0 && (
				<svg style={{ display: "none" }} aria-hidden="true">
					<defs>
						{referencedKeys.map((svg) => (
							<SvgGroup
								key={svg}
								id={getSvgId(config.namespace, svg)}
								svg={svg}
								config={config}
							/>
						))}
					</defs>
				</svg>
			)}

			{children}
		</SvgConfigContext.Provider>
	)
})

SvgProviderComponent.displayName = "SvgProvider"

/**
 * The svg map is inferred from the config, so the `<Svg />`s below can be
 * checked against the same map.
 */
export const SvgProvider = SvgProviderComponent as <
	SvgMapT extends SvgMap = SvgMap,
>(
	props: SvgProviderProps<SvgMapT>,
) => React.JSX.Element
