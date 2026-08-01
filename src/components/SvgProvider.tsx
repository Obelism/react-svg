"use client"

import type React from "react"
import { memo } from "react"

import { SvgConfigContext } from "../config/SvgConfigContext"
import type { SvgConfig, SvgMap } from "../config/types"
import { SvgDefinitions } from "./SvgDefinitions"

export type SvgProviderProps<SvgMapT extends SvgMap = SvgMap> = {
	config: SvgConfig<SvgMapT>
	children?: React.ReactNode
}

/**
 * Makes the config available to every `<Svg />` below it, and renders the
 * definitions block that the `type="link"` svgs point their `<use>` at.
 *
 * Build the config once with `createSvgConfig()`, or take it from
 * `setupReactSvg()`. Resolving raw options here instead would hand every svg
 * below a freshly identified config on each render.
 *
 * Which svgs get defined, what their ids are and where their markup comes from
 * all belong to the linked set now; the provider only decides where the block
 * sits in the tree.
 */
const SvgProviderComponent = memo(({ config, children }: SvgProviderProps) => (
	<SvgConfigContext.Provider value={config}>
		<SvgDefinitions />
		{children}
	</SvgConfigContext.Provider>
))

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
