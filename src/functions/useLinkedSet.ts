"use client"

import { useCallback, useMemo } from "react"
import useSWR, { type KeyedMutator, useSWRConfig } from "swr"

import { getSvgId } from "../_shared/getSvgId"
import { resolveSvgUrl } from "../_shared/resolveSvgUrl"
import { useSvgConfig } from "../config/SvgConfigContext"

/**
 * The linked set: which svgs a page has linked so far, and whether each one's
 * markup has arrived. One set per namespace, held in SWR's cache so every
 * component configured with the same namespace sees the same set.
 *
 * Everything below the two exported hooks is implementation — the cache keys,
 * the id format, and how a key becomes a url are not the callers' business.
 */

const useSharedState = <TData = unknown>(
	key: string,
	initialData?: TData,
): [TData | undefined, KeyedMutator<TData>] => {
	const { data, mutate } = useSWR<TData>(key, { fallbackData: initialData })
	return [data, mutate]
}

const SHARED_STATE_PREFIX = "obelism-react-svg"

const EMPTY_SET: Record<string, boolean> = {}

/** `namespace` scopes the set, so two configs in one app stay separate. */
const getSetKey = (namespace: string) =>
	`${SHARED_STATE_PREFIX}-${namespace}-linked`

const useSet = (namespace: string) =>
	useSharedState(getSetKey(namespace), EMPTY_SET)

const useLoaded = (
	namespace: string,
	svg: string,
): [boolean | undefined, KeyedMutator<boolean>] =>
	useSharedState(`${SHARED_STATE_PREFIX}-${namespace}-${svg}`, false)

/** One member of the linked set, ready for the definitions block to render. */
export type LinkedSvgEntry = {
	key: string
	id: string
	url: string
}

/**
 * What a single linked svg needs: the id to point a `<use>` at, whether its
 * markup has arrived, and how to add itself to the set.
 */
export const useLinkedSvg = (svg: string) => {
	const { namespace } = useSvgConfig()
	const { mutate } = useSWRConfig()
	const [loaded] = useLoaded(namespace, svg)

	// Writes to the set without subscribing to it. A page can hold hundreds of
	// linked svgs that all register in the same commit: subscribed, each write
	// would make every one of them compare the whole set again, and merging from
	// a set captured at render time would drop all but the last write.
	const register = useCallback(
		() =>
			mutate<Record<string, boolean>>(
				getSetKey(namespace),
				(current = EMPTY_SET) =>
					current[svg] ? current : { ...current, [svg]: true },
				{ revalidate: false },
			),
		[mutate, namespace, svg],
	)

	return { id: getSvgId(namespace, svg), loaded: !!loaded, register }
}

/**
 * The part of the linked set this config is responsible for defining.
 *
 * Keys belonging to a different svg map are filtered out: the set is shared by
 * namespace, so two configs on one namespace see each other's keys and must not
 * define them under the same ids.
 */
export const useLinkedSvgs = (): LinkedSvgEntry[] => {
	const config = useSvgConfig()
	const [set] = useSet(config.namespace)

	return useMemo(() => {
		if (!set) return []

		return Object.keys(set)
			.filter((key) => key in config.svgMap)
			.map((key) => ({
				key,
				id: getSvgId(config.namespace, key),
				url: resolveSvgUrl(config, key),
			}))
	}, [set, config])
}

/**
 * Records that a linked svg's markup has arrived. Only the definitions block
 * calls this — it owns the fetch the linked set cares about.
 */
export const useMarkLinkedSvgLoaded = (svg: string) => {
	const { namespace } = useSvgConfig()
	const [loaded, setLoaded] = useLoaded(namespace, svg)

	return useMemo(() => {
		if (loaded) return () => {}

		return () => {
			setLoaded(true, {
				optimisticData: true,
				revalidate: false,
				populateCache: true,
			})
		}
	}, [loaded, setLoaded])
}
