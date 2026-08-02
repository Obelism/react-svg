"use client"

import { createContext, useContext } from "react"

import type { SvgConfig } from "./types"

export const SvgConfigContext = createContext<SvgConfig | null>(null)

SvgConfigContext.displayName = "SvgConfigContext"

/**
 * @function useSvgConfig
 * @description Resolve the config a component should use: an explicitly passed
 * `config` prop wins, otherwise the nearest `<SvgProvider />` provides it.
 */
export const useSvgConfig = (config?: SvgConfig): SvgConfig => {
	const contextConfig = useContext(SvgConfigContext)
	const resolvedConfig = config || contextConfig

	if (!resolvedConfig) {
		throw new Error(
			"react-svg - No svg config found. Render this component inside a configured <SvgProvider />, pass it a `config` prop, or use the components returned by setupReactSvg(...)",
		)
	}

	return resolvedConfig
}
