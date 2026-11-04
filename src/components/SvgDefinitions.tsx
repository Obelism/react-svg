"use client"

import type React from "react"
import { memo } from "react"

import {
	type LinkedSvgEntry,
	useLinkedSvgs,
	useMarkLinkedSvgLoaded,
} from "../functions/useLinkedSet"
import { SvgGroup } from "./SvgGroup"

const HIDDEN_STYLE = Object.freeze({
	position: "absolute",
	width: 0,
	height: 0,
	overflow: "hidden",
	pointerEvents: "none",
}) satisfies React.CSSProperties

/**
 * One definition: fetches a linked svg's markup and records its arrival with the
 * linked set. A component per member, so the hooks stay one per component
 * rather than being called in a loop.
 */
const SvgDefinition = ({ entry }: { entry: LinkedSvgEntry }) => {
	const markLoaded = useMarkLinkedSvgLoaded(entry.key)

	return <SvgGroup id={entry.id} url={entry.url} onLoaded={markLoaded} />
}

/**
 * The definitions block: the hidden svg element holding one definition per
 * linked svg, which the `type="link"` svgs elsewhere on the page point their
 * `<use>` at. Exists once per config.
 *
 * Reads the linked set from context, which is why it is a child of the provider
 * rather than inline in it — a provider cannot read the context it provides.
 */
export const SvgDefinitions = memo(() => {
	const linkedSvgs = useLinkedSvgs()

	if (linkedSvgs.length === 0) return null

	return (
		<svg
			width="0"
			height="0"
			// display: none makes browsers drop the gradients, masks and clip
			// paths inside it that the referencing svgs point at.
			style={HIDDEN_STYLE}
			aria-hidden="true"
		>
			<defs>
				{linkedSvgs.map((entry) => (
					<SvgDefinition key={entry.key} entry={entry} />
				))}
			</defs>
		</svg>
	)
})

SvgDefinitions.displayName = "SvgDefinitions"
