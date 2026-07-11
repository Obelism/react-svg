import { useCallback, useMemo } from "react"
import useSWR, { type KeyedMutator } from "swr"

const useSharedState = <TData = unknown>(
	key: string,
	initialData?: TData,
): [TData | undefined, KeyedMutator<TData>] => {
	const { data, mutate } = useSWR<TData>(key, { fallbackData: initialData })
	return [data, mutate]
}

const SHARED_STATE_PREFIX = "obelism-react-svg"

const INITIAL_LINKED_SVG_LIST: Record<string, boolean> = {}

/**
 * `namespace` scopes the shared SWR cache keys to a single setupReactSvg()
 * instance, so two instances mounted in the same app don't read/write each
 * other's linked-svg state.
 */
export const useLinkedSvgList = (namespace: string) =>
	useSharedState(
		`${SHARED_STATE_PREFIX}-${namespace}-linked`,
		INITIAL_LINKED_SVG_LIST,
	)

export const useLinkSvg = (namespace: string) => {
	const [linkedSvgList = INITIAL_LINKED_SVG_LIST, setLinkedSvgList] =
		useLinkedSvgList(namespace)

	return useCallback(
		(svg: string) => {
			if (!linkedSvgList || linkedSvgList[svg]) return

			return setLinkedSvgList({
				...linkedSvgList,
				[svg]: true,
			})
		},
		[linkedSvgList, setLinkedSvgList],
	)
}

const useLinkedSvg = (
	namespace: string,
	svg: string,
): [boolean | undefined, KeyedMutator<boolean>] => {
	return useSharedState(`${SHARED_STATE_PREFIX}-${namespace}-${svg}`, false)
}

export const useLinkedSvgLoaded = (namespace: string, svg: string) => {
	return useLinkedSvg(namespace, svg)?.at(0)
}

export const useSetLinkedSvgLoaded = (namespace: string, svg: string) => {
	const [svgLoaded, setSvgLoaded] = useLinkedSvg(namespace, svg)

	return useMemo(() => {
		if (svgLoaded) return () => {}
		return () => {
			return setSvgLoaded(true, {
				optimisticData: true,
				revalidate: false,
				populateCache: true,
			})
		}
	}, [svgLoaded, setSvgLoaded])
}
